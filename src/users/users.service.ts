import { HttpException, Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import { BasicService, PaginatedResult } from '../_basics/BasicService'
import { ReadUserGroupsDto } from './dto/read-user-groups.dto'
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto'
import { FindAllUserFilterMap } from './dto/filters/find-all-user.filter'
import { ConfigService } from '@nestjs/config'
import { AuthRequest } from 'src/_basics/AuthRequest'
import { UserBasic, userBasicProjection } from './entities/user.basic.entity'
import { ReadUserDto } from './dto/read-user.dto'
import { UpdateUserPackDto } from './dto/update-user-pack.dto'
import { OrdersService } from '../orders/orders.service'
import { AxiosService } from '../axios/axios.service'
import { formatMoney } from '../utilities/Formatters'
import { Attachment } from '../_schemas/attachment.schema'
import { AxiosResponse } from 'axios'
import { FillClubContractDto } from './dto/fill-club-contract.dto'
import { UpdateException } from '../_exceptions/update.exception'
import { PackEnum } from '../packs/enums/pack.enum'
import { UserAclRolesEnum } from './enums/user.acl.roles.enum'
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto'

@Injectable()
export class UsersService extends BasicService {
  model: any
  
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>,
    private httpService: AxiosService,
    protected config: ConfigService,
    protected orderService: OrdersService,
    @Inject('REQUEST') protected request: AuthRequest) {
    super()
    this.model = userModel
  }
  
  create (createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }
  
  async findAll (paginationDto: PaginatedFilterUserDto): Promise<PaginatedResult<User[]>> {
    const query: any = this.prepareQuery((paginationDto.filter ?? {}), FindAllUserFilterMap)
    
    if (query.user) {
      query.$or = [
        { 'firstName': query.user },
        { 'lastName': query.user }
      ]
      
      delete query.user
    }
    
    return await this.findPaginated<User>({
        ...query,
        gold: true,
        // @ts-ignore
        apps: 'club'
      }, paginationDto,
      userBasicProjection
    )
  }
  
  async findForOptionsList (value: string) {
    if (!value || value.trim().length <= 2) {
      return []
    }
    
    const toSearch = value.split(' ')
    
    const projection = { firstName: 1, lastName: 1 }
    const filter = {
      roles: {
        $in: [UserAclRolesEnum.AGENT, UserAclRolesEnum.CLIENT]
      },
      $or: [
        { firstName: new RegExp(toSearch.join('|'), 'i') },
        { lastName: new RegExp(toSearch.join('|'), 'i') }
      ]
    }
    
    const data = await this.model.find(filter, projection,
      {
        limit: 50
      }).sort({ firstName: 1, lastName: 1 })
    
    return data.map(el => {
      return el.firstName.trim() + ' ' + el.lastName.trim()
    })
  }
  
  async groupBy (field: keyof User): Promise<ReadUserGroupsDto[]> {
    return this.userModel.aggregate<ReadUserGroupsDto>([
      {
        $match: {
          gold: true,
          apps: 'club'
        }
      },
      {
        $group: {
          _id: '$' + field,
          count: { $sum: 1 }
        }
      }
    ]).exec()
  }
  
  async findOne (id: string, query?: ReadUserDto): Promise<UserBasic | User> {
    const projection = query.full ? {
      password: 0 // avoid returning user password
    } : userBasicProjection
    
    return await this.userModel.findById(id, projection).exec()
  }
  
  async findAdmins () {
    return await this.userModel.where({
      roles: {
        $in: [UserAclRolesEnum.ADMIN, UserAclRolesEnum.CLUB_ADMIN]
      }
    }).exec()
  }
  
  async calcUserDeposit (id: string) {
    try {
      const result = await this.httpService.get(this.config.get<string>('http.mainServerUrl') + `/users/${id}/deposit`)
      
      return result.data
    } catch (er: any) {
      let message = er.response?.data?.error?.message || er.response?.statusText || er.message
      let code = er.response?.status || 400
      
      const exception = new HttpException(message, code)
      
      exception.stack = er.response?.data?.error?.frames
      
      return Promise.reject(exception)
    }
  }
  
  async update (id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.findOrFail(id)
    
    // return only the changed keys;
    return this.userModel.findByIdAndUpdate(id, updateUserDto as any, {
      new: true,
      projection: Object.keys(updateUserDto).reduce((acc, key) => {
        acc[key] = 1
        return acc
      }, {})
    })
  }
  
  /**
   * Function to change a users pack.
   *
   * - [ ] Facciamo un prodotto (premium, nascosto) Quando l’utennte clicca “passa “a premium, si crea in automatico e viene poi visto come ordine lato admin.
   * - [ ] Costo 5% del deposito attuale dell’utente. (Nelle note indicare il deposito attuale ed il valore del 5% in €, mentre il prezzo del prodotto deve essere a 0. All’approvazione, il cliente passa a premium.)
   *     - [ ] Contratto. Generare PDF compilato che l’utente deve scaricare, firmare e ricaricare.
   *     - [ ] Nel creare l’ordine, nel primo messaggio dell’ordine, inserire il contratto generato con le indicazioni su come procedere…
   *     - [ ] Aggiungere possibilità di caricare foto dal telefono.
   * - [ ] Scadenza contratto
   *     - [ ] Scadenza 12mesi a partire dal giorno in cui lo attivo. Per ora non è retroattiva.
   *     - [ ] Attivare un cron giornaliero che controlla i contratti che devono scadere
   *         - [ ] Se un contratto premium è scaduto, l’utente ritorna basic,
   *         - [ ] 1 mese prima, inviare notifica che avvisa che il contratto scadrà il giorno x. Da quel momento in poi l’utente potrà rinnovare il contratto, facendo il solito pagamento e aspettando la conferma admin. Quando il contratto scade, se ‘è un rinnovo già fatto, viene subito riattivato.
   *             - [ ] Rifare la notifica 1 settimana prima, se non ha già rinnovato
   *         - [ ] Se non è stato rinnovato, il giorno della scadenza inviare notifica che è scaduto ed è tornato a basic.
   *             - [ ] Da li, il ciclo si ripete e quindi l’utente può ripassare a premium come prima.
   *
   * @param id
   * @param updateUserPackDto
   */
  async updatePack (id: string, updateUserPackDto: UpdateUserPackDto) {
    const userToUpdate: UserDocument = await this.findOrFail(id)
    
    if (userToUpdate.clubPack === PackEnum.PREMIUM) {
      throw new UpdateException('Il pack è già premium')
    }
    
    // Check if already exists a pending request
    if (userToUpdate.clubPackChangeOrder) {
      throw new UpdateException('Esiste già una richiesta di cambio pack in corso.')
    }
    
    const userDeposit = await this.calcUserDeposit(id)
    const changeCost = userDeposit * 5 / 100
    let contractFile: Attachment | null = null
    
    try {
      // Generate the contract file
      contractFile = await this.generateClubContractPdf({
        ...userToUpdate.toObject(),
        'birthDate': userToUpdate.birthDate ? userToUpdate.birthDate.toISOString() : '',
        'packCost': changeCost,
        'currentYear': new Date().getFullYear(),
        'currentDate': new Date()
      })
      
      // Generate the new order with relative communication
      const newOrder = await this.orderService.createPackChangeOrder({
        notes: `Cambio pack da ${userToUpdate.clubPack} a <strong>Premium</strong>.<br>
              Costo: 5% del deposito<br>
              Deposito: € ${formatMoney(userDeposit)}<br>
              Costo cambio: € ${formatMoney(changeCost)}`,
        products: [
          {
            id: 'clubPack',
            qta: 1,
            price: 0
          }
        ]
      }, userDeposit, changeCost, contractFile)
      
      // Store the order id in user data
      userToUpdate.clubPackChangeOrder = newOrder._id
      await userToUpdate.save()
      
      // return the updated user
      return userToUpdate
    } catch (er) {
      if (contractFile) {
        // If there is an error, must remove the generated contract file
        await this.removeClubContractPdf(contractFile.id)
      }
      
      throw er
    }
  }
  
  async updatePreferences (userId: string, preferences: UpdateUserPreferencesDto) {
    const userToUpdate: UserDocument = await this.findOrFail(userId)
    
    // userToUpdate.preferences.club = preferences
    // await userToUpdate.save()
    
    return userToUpdate
  }
  
  remove (id: number) {
    return `This action removes a #${id} user`
  }
  
  private async generateClubContractPdf (data: FillClubContractDto): Promise<Attachment> {
    if (data.referenceAgent) {
      const refAgent: UserDocument = await this.model.findById(data.referenceAgent)
      
      data.referenceAgent = refAgent ? refAgent.firstName + refAgent.lastName : ''
    }
    
    const resp: AxiosResponse<Attachment> = await this.httpService.post(this.config.get<string>('http.filesServerUrl') + '/fill_and_store', {
      template: 'club_pack_change',
      data
    })
    
    return resp.data
  }
  
  private async removeClubContractPdf (id: string) {
    try {
      await this.httpService.delete(this.config.get<string>('http.filesServerUrl') + '/' + id)
    } catch (er) {
      // If fails, it doesn't matter becuase this is called when the packChange fails.
      console.log(er)
    }
  }
}
