const Competency = require('../models/Competency');
const Course = require('../models/Course');
const TrainerProfile = require('../models/TrainerProfile');

/**
 * Calculates skill gaps, overall competency score, recommended courses, and recommended trainers for a trainee.
 */
async function analyzeTraineeCompetency(traineeProfile) {
  const targetTitle = traineeProfile.targetCompetency || 'Technical Project Lead';
  
  // Fetch competency target schema or create default if not found
  let targetComp = await Competency.findOne({ title: targetTitle });
  if (!targetComp) {
    targetComp = {
      title: targetTitle,
      description: 'Prepares IT professionals for technical project leadership and cloud engineering management.',
      requiredSkills: [
        { skill: 'Cloud Computing', requiredLevel: 'Advanced', targetScore: 85 },
        { skill: 'Leadership', requiredLevel: 'Advanced', targetScore: 80 },
        { skill: 'Project Management', requiredLevel: 'Intermediate', targetScore: 80 },
        { skill: 'Python', requiredLevel: 'Intermediate', targetScore: 75 },
        { skill: 'SQL', requiredLevel: 'Intermediate', targetScore: 70 },
        { skill: 'DevOps & Docker', requiredLevel: 'Intermediate', targetScore: 75 }
      ]
    };
  }

  const currentSkillMap = new Map();
  (traineeProfile.currentSkills || []).forEach(s => {
    if (!s) return;
    const name = typeof s === 'string' ? s : (s.skill || '');
    const score = (typeof s === 'object' && typeof s.score === 'number') ? s.score : 50;
    if (name) {
      currentSkillMap.set(name.toLowerCase(), score);
    }
  });

  const identifiedGaps = [];
  let totalCurrentPoints = 0;
  let totalTargetPoints = 0;

  targetComp.requiredSkills.forEach(req => {
    const skillNameLower = req.skill.toLowerCase();
    const currentScore = currentSkillMap.get(skillNameLower) || 0;
    const reqScore = req.targetScore || 80;
    const diff = reqScore - currentScore;

    totalCurrentPoints += currentScore;
    totalTargetPoints += reqScore;

    let gapLevel = 'LOW GAP';
    if (diff > 40) gapLevel = 'HIGH GAP';
    else if (diff > 15) gapLevel = 'MEDIUM GAP';

    if (diff > 0) {
      identifiedGaps.push({
        skill: req.skill,
        gapLevel,
        currentScore,
        requiredScore: reqScore,
        diff,
        description: `Requires ${req.requiredLevel} level proficiency. Currently at ${currentScore}%.`
      });
    }
  });

  // Sort gaps by severity (highest diff first)
  identifiedGaps.sort((a, b) => b.diff - a.diff);

  // Calculate overall competency score (0-100)
  const overallCompetencyScore = totalTargetPoints > 0 
    ? Math.round((totalCurrentPoints / totalTargetPoints) * 100) 
    : 72;

  // Extract top high gap skills
  const topGapSkills = identifiedGaps
    .filter(g => g.gapLevel === 'HIGH GAP' || g.gapLevel === 'MEDIUM GAP')
    .map(g => g.skill);

  // Recommend Courses matching gap skills
  const allCourses = await Course.find({}).populate('trainer', 'name email');
  const recommendedCourses = allCourses.map(course => {
    let matchScore = 0;
    const courseTags = [course.category, course.title, ...(course.competencyTags || [])].map(t => t.toLowerCase());
    
    topGapSkills.forEach(skill => {
      if (courseTags.some(t => t.includes(skill.toLowerCase()) || skill.toLowerCase().includes(t))) {
        matchScore += 30;
      }
    });

    if (course.difficulty === 'Intermediate') matchScore += 10;
    return {
      course,
      relevanceScore: Math.min(98, 60 + matchScore)
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 4);

  // Recommend Trainers matching top gap skills
  const trainers = await TrainerProfile.find({}).populate('user', 'name email avatar');
  const recommendedTrainers = trainers.map(trainer => {
    let matchedSkillsCount = 0;
    const trainerSkills = [...(trainer.expertise || []), ...(trainer.subjects || [])].map(s => s.toLowerCase());

    const matchedList = [];
    topGapSkills.forEach(skill => {
      const match = trainerSkills.find(ts => ts.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ts));
      if (match) {
        matchedSkillsCount++;
        matchedList.push(skill);
      }
    });

    const gapRatio = topGapSkills.length > 0 ? (matchedSkillsCount / topGapSkills.length) : 1;
    const ratingFactor = (trainer.rating || 4.5) / 5;
    const matchPercentage = Math.round((gapRatio * 65) + (ratingFactor * 35));

    return {
      trainer,
      matchPercentage: Math.min(98, Math.max(75, matchPercentage)),
      matchedSkills: matchedList,
      why: `✓ Matches ${matchedList.join(', ') || 'required'} competency gap\n✓ Relevant industry experience (${trainer.experienceYears} yrs)\n✓ High trainee rating (${trainer.rating}/5.0)`
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

  return {
    targetCompetency: targetComp.title,
    overallCompetencyScore,
    identifiedGaps,
    recommendedCourses,
    recommendedTrainers
  };
}

module.exports = { analyzeTraineeCompetency };
