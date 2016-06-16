db.getCollection('docs').find(
  {
    "$and":
      [
        {
          "reception.office": {
            "$in": [
              "Contraloría Interna", "Gerencia de Personal"
            ]
          }
        },
        {
          "date" : {
            "$gte":ISODate("2015-10-23T09:00:00.000Z"),
            "$lte":ISODate("2015-12-23T09:00:00.000Z")
           }
        }
      ]
  }
);

db.docs.ensureIndex(
  {
    'comment':'text',
    'reception.office': 'text',
    'reception.subject':'text',
    'reception.contents':'text',
    'response.number':'text',
    'response.senderOrganization':'text',
    'response.sender':'text'
  },
  {
    sparse: true,
    weights:
    {
      'comment': 1,
      'reception.office':2,
      'reception.subject':10,
      'reception.contents': 5,
      'response.number':1,
      'response.senderOrganization':2,
      'response.sender':2
    },
    name: 'ContentTextIndex',
    default_language: 'spanish'
  }
);
