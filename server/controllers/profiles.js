const models = require('../../db/models');

// module.exports.getAll = (req, res) => {
//POSTGRES
//   models.Profile.fetchAll()
//     .then(profiles => {
//       res.status(200).send(profiles);
//     })
//     .catch(err => {
//       // This code indicates an outside service (the database) did not respond in time
//       res.status(503).send(err);
//     });
//MONGO
//     models.findOneAndUpdate({ _id: request.body.id }, {$set: {Entry: request.body.entry}}, function (err) {
//       if (err) return handleError(err);
//       console.log('success');
//     })
    
//     response.end();
// };

 