const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  const { title, description, price, category, condition } = req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];
  const listing = await Listing.create({
    title, description, price, category, condition, images,
    seller: req.user._id,
    college: req.user.college,
  });
  res.status(201).json(listing);
};

exports.getListings = async (req, res) => {
  const { category, college, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
  const query = { isAvailable: true };
  if (category) query.category = category;
  if (college) query.college = college;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('seller', 'name college year phone')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate('seller', 'name college year phone email');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json(listing);
};

exports.getRelatedListings = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Not found' });
  const related = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
    isAvailable: true,
  }).populate('seller', 'name college').limit(4).sort({ createdAt: -1 });
  res.json(related);
};

exports.updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (listing.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  const { title, description, price, category, condition, isAvailable } = req.body;
  if (title !== undefined) listing.title = title;
  if (description !== undefined) listing.description = description;
  if (price !== undefined) listing.price = price;
  if (category !== undefined) listing.category = category;
  if (condition !== undefined) listing.condition = condition;
  if (isAvailable !== undefined) listing.isAvailable = isAvailable;
  await listing.save();
  res.json(listing);
};

exports.deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (listing.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await listing.deleteOne();
  res.json({ message: 'Listing removed' });
};

exports.expressInterest = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate('seller', 'name phone email college');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const alreadyInterested = listing.interestedUsers.includes(req.user._id);
  if (!alreadyInterested) {
    listing.interestedUsers.push(req.user._id);
    await listing.save();
  }
  res.json({
    message: 'Interest noted!',
    sellerContact: {
      name: listing.seller.name,
      phone: listing.seller.phone,
      email: listing.seller.email,
    },
  });
};

exports.toggleSave = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const idx = listing.savedBy.findIndex(id => id.toString() === req.user._id.toString());
  if (idx === -1) {
    listing.savedBy.push(req.user._id);
  } else {
    listing.savedBy.splice(idx, 1);
  }
  await listing.save();
  res.json({ saved: idx === -1, saveCount: listing.savedBy.length });
};

exports.getSavedListings = async (req, res) => {
  const listings = await Listing.find({ savedBy: req.user._id, isAvailable: true })
    .populate('seller', 'name college year')
    .sort({ createdAt: -1 });
  res.json(listings);
};

exports.getMyListings = async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
};
