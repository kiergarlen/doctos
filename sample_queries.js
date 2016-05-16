db.getCollection('MyCollection').find(
{
  "$and" :
    [
      { "name" : { "$in" : [ "Joe", "Jane"]}} ,
      { "date" : {
            "$gte" :ISODate("2015-11-23T09:00:00.000Z"),
             "$lte":ISODate("2015-11-23T09:00:00.000Z")
         }
    ]
})




db.oficios.ensureIndex(
  {
    'comment':'text',
    'reception.office': 'text',
    'reception.area': 'text',
    'reception.subject':'text',
    'reception.contents':'text'
  },
  {
    sparse: true,
    weights:
    {
      'comment': 1,
      'reception.office':2,
      'reception.area':2,
      'reception.subject':10,
      'reception.contents': 5
    },
    name: 'ContentTextIndex',
    default_language: 'spanish'
  }
);