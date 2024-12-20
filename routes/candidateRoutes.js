const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../jwt');
const User = require('../models/user')
const Candidate = require('../models/candidate');


const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role === 'admin';
    } catch (err) {
        return false;
    }
}


//Post route to add a Candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'user does not have admin role' })
        }
        const data = req.body;  //Assuming the request body contains the Candidate data

        //create a new Candidate document using the mongoose model
        const newCandidate = new Candidate(data);

        //save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({ response: response });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })
    }
})



//PUT operation
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'user does not have admin role' })
        }
        const candidateID = req.params.candidateID; //Extract the Id from the URL parameter
        const updateCandidateData = req.body; //Updated data for the candidate

        //Find the user by userId
        const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, {
            new: true,//Return the updated document
            runValidators: true,//Run mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'user does not have admin role' })
        }
        const candidateID = req.params.candidateID; //Extract the Id from the URL parameter

        //Find the user by userId
        const response = await Candidate.findByIdAndDelete(candidateID)

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate deleted');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res) => {
    //no admin can vote
    //user can only vote once

    candidateID = req.params.candidateID;
    userID = req.user.id;

    try {
        //Find the candidate document with the specified candidate
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const user = await User.findById(userID);
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        if(user.isVoted){
            res.status(400).json({message: 'You have already voted'})
        }
        if(user.role==='admin'){
            res.status(403).json({message:'Admin is not allowed'})
        }

        //update the Candidate document to record the vote
        candidate.votes.push({user:userID})
        candidate.voteCount++;
        await candidate.save();

        //update the user document
        user.isVoted=true
        await user.save();

        res.status(500).json({message: 'Vote recorded successfully'});
    }
catch(err){
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
}}
);

//Vote Count
router.get('/vote/count',async(req,res)=>{
    try{
        //Find all the candidate and sort them by voteCount in descending order
const candidate=await Candidate.find().sort({voteCount:'desc'});

//Map the candidate to only return their name and voteCount
const voteRecord = candidate.map((data)=>{
    return{
        party:data.party,
        count: data.voteCount
    }
});
return res.status(200).json(voteRecord);

    }catch(err){
        console.log(err);
    res.status(500).json({ error: 'Internal server error' });
    }
});

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;