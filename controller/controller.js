require("dotenv").config(); 
const mongoose = require("mongoose");
const express = require('express');
const Users = require("../model/schema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltrounds = 10;


exports.register = async (req, res, next) => {
    try {
      const { phone, password,} = req.body;

    //   if(password !== confirmpassword ){
    //     return res.status(400).json({ status: "failed", message: "The password is not the same" });
    //   }
  
      const existingUser = await Users.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ status: "failed", message: "Phone already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, saltrounds);
  
      const newUser = new Users({
        username: phone,
        password: hashedPassword
      });
  
      await newUser.save();
  
      res.status(200).json({ status: "success", message: "Register success" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Register failed" });
    }
  };

  exports.login = async (req, res, next) => {
    try {
        //get the data react native
        const { phone, password } = req.body;
         
    
        //checks if phone and password has value
        if (!phone || !password) {
            return res.status(400).json({ status: "failed", message: "Phone and password are required" });
        }
        
        //finds the user base on the phone
        const user = await Users.findOne({ username: phone }); 
        
        
        //kun wala may nakita nga phone number sa db
        if (!user) {
            return res.status(400).json({ status: "failed", message: "Invalid phone number or password" });
        }
        
        //na compare ang password sa password sa db
        const isMatch = await bcrypt.compare(password, user.password);
        
        //if ndi match ga error
        if (!isMatch) {
            return res.status(400).json({ status: "failed", message: "Invalid phone number or password" });
        }

        //ubra token after ma login succesfully
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ,{ expiresIn: "1h" });

           // Log if token is created
        if (token) {
            console.log("Token created: ", token);
        } else {
            console.log("Token creation failed");
        }
        
        //send sa mobile success
        res.status(200).json({ status: "success", message: "Login successful", token: token});

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Login failed" });
    }
};

exports.addHome = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.body;
    const userId = req.user.id; // Extracted from token

    
    if (!longitude || !latitude || !userId) {
      return res.status(400).json({ status: "failed", message: "Longitude, latitude, or user ID is missing" });
    }

    const home = {
      home_id: new mongoose.Types.ObjectId(), // Unique ID for each home
      longitude,
      latitude
    };

    const homeQuery = await Users.updateOne(
      { _id: userId },  // Ensure you're using `_id` from MongoDB
      { $push: { homes: home } }
    );

    if (homeQuery.modifiedCount === 0) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Home added successfully",
      home
    });

  } catch (error) {
    next(error);
  }
};

exports.displayHomes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ status: "failed", message: "Access Denied" });
    }

    const user = await Users.findById(userId).select("homes");

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Homes retrieved successfully",
      homes: user.homes
    });
  
  } catch (error) {
    console.error("Error retrieving homes:", error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};

   
exports.example = async (req, res, next) => {
console.log('example');
};





 
