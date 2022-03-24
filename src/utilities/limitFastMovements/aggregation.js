export default [
  {
    '$match': {
      'clubPack': 'fast',
      'expiresAt': {
        '$gte': new Date('Mon, 07 Mar 2022 17:25:00 GMT')
      }
    }
  }, {
    '$group': {
      '_id': {
        'user': '$userId',
        'semsterId': '$semesterId'
      },
      'movements': {
        '$push': '$$ROOT'
      },
      'num': {
        '$sum': 1
      },
      'sumEarned': {
        '$sum': {
          '$switch': {
            'branches': [
              {
                'case': {
                  '$in': [
                    '$movementType', [
                      'deposit_added', 'interest_recapitalized'
                    ]
                  ]
                },
                'then': '$amountChange'
              }
            ],
            'default': 0
          }
        }
      },
      'sumUsed': {
        '$sum': {
          '$switch': {
            'branches': [
              {
                'case': {
                  '$in': [
                    '$movementType', [
                      'deposit_removed', 'deposit_transferred', 'deposit_used'
                    ]
                  ]
                },
                'then': '$amountChange'
              }
            ],
            'default': 0
          }
        }
      }
    }
  }, {
    '$addFields': {
      'sumRemaining': {
        '$subtract': [
          '$sumEarned', '$sumUsed'
        ]
      }
    }
  }, {
    '$match': {
      'sumEarned': {
        '$gt': 6000
      }
    }
  }, {
    '$sort': {
      '_id.user': 1,
      '_id.year': 1,
      '_id.month': 1
    }
  }
]
