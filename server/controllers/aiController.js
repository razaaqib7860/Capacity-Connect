const aiService = require('../services/aiService');
const TraineeProfile = require('../models/TraineeProfile');
const TrainerProfile = require('../models/TrainerProfile');
const { analyzeTraineeCompetency } = require('../services/competencyEngine');

exports.analyzeGap = async (req, res) => {
  try {
    const userId = req.user._id;
    let profile = await TraineeProfile.findOne({ user: userId });
    if (!profile) {
      profile = await TraineeProfile.create({ user: userId });
    }

    const engineAnalysis = await analyzeTraineeCompetency(profile);

    const aiAdvice = await aiService.generateGapAnalysis(
      req.user.name,
      profile.currentSkills,
      profile.targetCompetency || 'Technical Project Lead',
      engineAnalysis.identifiedGaps
    );

    res.json({
      engineAnalysis,
      aiAdvice
    });
  } catch (err) {
    console.error('AI controller error:', err);
    res.status(500).json({ message: 'Server error in AI analysis' });
  }
};

exports.explainTrainerMatch = async (req, res) => {
  try {
    const { trainerId } = req.body;
    const traineeName = req.user.name;

    const trainer = await TrainerProfile.findById(trainerId).populate('user', 'name');
    let profile = await TraineeProfile.findOne({ user: req.user._id });
    if (!profile) profile = await TraineeProfile.create({ user: req.user._id });

    const engineAnalysis = await analyzeTraineeCompetency(profile);

    const result = await aiService.explainTrainerMatch(
      traineeName,
      trainer ? trainer.user.name : 'Dr. Ananya Sharma',
      trainer ? trainer.expertise : ['Cloud Computing', 'AWS', 'DevOps'],
      engineAnalysis.identifiedGaps
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
