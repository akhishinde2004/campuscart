const express = require('express');
const router = express.Router();
const {
  createListing, getListings, getListing,
  updateListing, deleteListing, expressInterest,
  getMyListings, toggleSave, getSavedListings, getRelatedListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getListings);
router.get('/mine', protect, getMyListings);
router.get('/saved', protect, getSavedListings);
router.get('/:id', getListing);
router.get('/:id/related', getRelatedListings);
router.post('/', protect, upload.array('images', 4), createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/interest', protect, expressInterest);
router.post('/:id/save', protect, toggleSave);

module.exports = router;
