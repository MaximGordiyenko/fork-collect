const express = require('express');
const router = express.Router();
const Fork = require('../../models/fork');
const User = require('../../models/users');

const app = express();
app.set("view engine", "hbs");

router.post('/', async (req, res) => {
  const { createForkName, createForkMessage, createForkType } = req.body;
  console.log(createForkName, createForkMessage, createForkType);
  let user = await User.findById(req.session.userId);
  const fork = {
    creation_date: Date.now(),
    createForkName: createForkName || 'unassigned',
    createForkMessage: createForkMessage || 'unassigned',
    createForkType: createForkType || 'unassigned',
    userId: user.id,
  };
  if (createForkName !== '' && createForkMessage !== '' && createForkType !== '') {
    try {
      const findFork = await Fork.find({
        createForkName: createForkName,
        createForkMessage: createForkMessage,
        createTypeFork: createForkType
      });
      if (findFork.length > 0) return res.status(409).send(`Conflict: the ${findFork.length} document exist in DB`);
      const createFork = await Fork.create(fork);
      return res.render('createFork.hbs', { 'fork': createFork });
    } catch (e) {
      res.status(500).send(e);
    }
  } else {
    return res.send(`Insert valid field`);
  }
});

router.get('/', async (req, res) => {
  const { id, creator, getForkType } = req.query;
  
  if (id === '' && creator === '' && getForkType === 'none' || id === undefined && creator === undefined && getForkType === undefined) {
    try {
      const findAllForks = await Fork.find({});
      return res.render('getFork.hbs', { 'fork': findAllForks });
    } catch (e) {
      res.status(500).send(e);
    }
  }
  
  if (id !== '' || creator === undefined && getForkType === undefined) {
    try {
      const findByID = await Fork.findById({ _id: id });
      if (!findByID) return res.status(404).send({ message: `Document with _id: ${id} doesn't found ` });
      return res.render('getFork.hbs', { 'fork': findByID });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  
  if (creator !== '' || id === '' && getForkType === '') {
    try {
      const findCreator = await Fork.find({ userId: creator });
      if (0 === findCreator.length) return res.status(404).send({ message: `Document with user: ${creator} doesn't found ` });
      // return res.status(200).send(findCreator);
      console.log(findCreator);
      return res.render('getFork.hbs', { 'fork': findCreator });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  
  if (getForkType === 'short' && id === '' && creator === '' ||
    getForkType === 'middle' && id === '' && creator === '' ||
    getForkType === 'middle' && id === '' && creator === '' ||
    getForkType === 'extra' && id === '' && creator === '') {
    try {
      const findShortFork = await Fork.find({ createForkType: getForkType });
      if (0 === findShortFork.length) return res.status(404).send({ message: `Document with user: ${getForkType} doesn't found ` });
      console.log(findShortFork);
      return res.render('getFork.hbs', { 'fork': findShortFork });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
});

module.exports = router;
