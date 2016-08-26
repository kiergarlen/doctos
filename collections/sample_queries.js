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
    'number':'text',
    'subject':'text',
    'contents':'text',
    'receiver.organization': 'text',
    'reception.controlNumber':'text',
    'reception.subject':'text',
    'reception.sender':'text'
  },
  {
    sparse: true,
    weights:
    {
      'number': 15,
      'subject': 10,
      'contents': 5,
      'receiver.organization': 2,
      'reception.controlNumber': 2,
      'reception.subject':2
    },
    name: 'ContentTextIndex',
    default_language: 'spanish'
  }
);

