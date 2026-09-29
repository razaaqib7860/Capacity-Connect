const { GoogleGenAI } = require('@google/genai');

/**
 * AI Service encapsulating Gemini API calls with structured JSON responses.
 * Provides fallback mock AI analysis if GEMINI_API_KEY is not set or network fails.
 */
class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Internal helper to execute prompt against active Gemini models with fallback list.
   */
  async generateContent(prompt) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const modelsToTry = [
      'gemini-flash-lite-latest',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];

    let lastError = null;
    for (const model of modelsToTry) {
      try {
        const response = await this.ai.models.generateContent({
          model,
          contents: prompt
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model [${model}] attempt failed: ${err.message}. Trying next fallback model...`);
      }
    }
    throw lastError || new Error('All Gemini model fallbacks failed');
  }

  /**
   * Comprehensive Gemini AI profile & competency gap analysis.
   */
  async generateGapAnalysis(profileData) {
    const data = typeof profileData === 'object' ? profileData : { name: String(profileData || 'Trainee') };
    const prompt = `You are an AI Capacity Building & Competency Coach for the CAPACITY CONNECT platform.
Analyze the following trainee's full professional background:

Name: ${data.name || 'Trainee'}
Highest Qualification: ${data.highestQualification || 'Bachelor of Technology/Science'} (${data.institution || 'University'})
Current Role: ${data.currentRole || 'Software Engineer'}
Target Competency: ${data.targetCompetency || 'Technical Project Lead'}
Current Skills: ${JSON.stringify(data.currentSkills || ['JavaScript', 'Python', 'SQL'])}
Career Interests: ${JSON.stringify(data.careerInterests || ['Cloud Infrastructure', 'DevOps'])}
Resume Summary: ${data.resumeText || 'Software developer with core programming background.'}
LinkedIn: ${data.linkedinUrl || 'N/A'}
GitHub: ${data.githubUrl || 'N/A'}

Return ONLY valid JSON with no extra commentary or markdown formatting:
{
  "summary": "2-sentence high-level summary of candidate strengths and skill gaps",
  "priorityFocusArea": "Primary skill area to target first",
  "skillGaps": [
    { "skill": "Cloud Computing", "gapLevel": "HIGH", "description": "Crucial for target competency" },
    { "skill": "DevOps & Docker", "gapLevel": "HIGH", "description": "Required for CI/CD automation" },
    { "skill": "System Design", "gapLevel": "MEDIUM", "description": "Important for architecture scaling" }
  ],
  "learningRoadmap": [
    { "phase": "Phase 1 (Weeks 1-2)", "objective": "Build Cloud Infrastructure Foundation", "recommendedAction": "Enroll in AWS Cloud Foundations" },
    { "phase": "Phase 2 (Weeks 3-4)", "objective": "Master Docker & CI/CD Pipelines", "recommendedAction": "Complete DevOps & Docker Essentials" },
    { "phase": "Phase 3 (Weeks 5-6)", "objective": "Engineering Leadership & Systems", "recommendedAction": "Study Leadership Essentials & attempt assessments" }
  ],
  "expectedOutcome": "Measurable career impact after completing recommendations"
}`;

    if (!this.apiKey) {
      return this.fallbackGapAnalysis(data);
    }

    try {
      const text = await this.generateContent(prompt);
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    } catch (err) {
      console.warn('Gemini API call failed, using rule-based AI fallback:', err.message);
      return this.fallbackGapAnalysis(data);
    }
  }

  /**
   * Explain trainer matching compatibility based on trainee gaps.
   */
  async explainTrainerMatch(traineeName, trainerName, trainerExpertise, gaps) {
    const prompt = `You are an AI Talent & Training Matchmaker for CAPACITY CONNECT.
Trainee: ${traineeName}
Trainer: ${trainerName}
Trainer Expertise: ${JSON.stringify(trainerExpertise)}
Trainee Skill Gaps: ${JSON.stringify(gaps)}

Return ONLY valid JSON:
{
  "matchScore": 94,
  "explanation": "Detailed 2-sentence explanation of why ${trainerName} is an optimal mentor for ${traineeName}.",
  "keySynergies": ["Expertise alignment", "Hands-on project mentoring"],
  "recommendedNextStep": "Book a 1-on-1 mentorship session"
}`;

    if (!this.apiKey) {
      return this.fallbackTrainerMatch(traineeName, trainerName, trainerExpertise);
    }

    try {
      const text = await this.generateContent(prompt);
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    } catch (err) {
      console.warn('Gemini trainer match failed, using fallback:', err.message);
      return this.fallbackTrainerMatch(traineeName, trainerName, trainerExpertise);
    }
  }

  fallbackGapAnalysis(profileData) {
    return {
      summary: `${profileData.name || 'Candidate'} has strong core fundamentals, but shows high priority skill gaps in Cloud Computing, DevOps, and System Design for the ${profileData.targetCompetency || 'Technical Project Lead'} role.`,
      priorityFocusArea: 'Cloud Computing & DevOps',
      skillGaps: [
        { skill: 'Cloud Computing', gapLevel: 'HIGH', description: 'Required for enterprise cloud infrastructure design' },
        { skill: 'DevOps & Docker', gapLevel: 'HIGH', description: 'Required for containerization and automated CI/CD' },
        { skill: 'System Design', gapLevel: 'MEDIUM', description: 'Important for scalable microservices architecture' }
      ],
      learningRoadmap: [
        {
          phase: 'Phase 1 (Weeks 1-2)',
          objective: 'Build Cloud Infrastructure Foundation',
          recommendedAction: 'Enroll in AWS Cloud Foundations & complete core lectures.'
        },
        {
          phase: 'Phase 2 (Weeks 3-4)',
          objective: 'Master Containerization & CI/CD',
          recommendedAction: 'Study DevOps & Docker Essentials and submit assignments.'
        },
        {
          phase: 'Phase 3 (Weeks 5-6)',
          objective: 'Assessment & Official Certification',
          recommendedAction: 'Attempt subject MCQ quizzes to earn verified certificates.'
        }
      ],
      expectedOutcome: `Elevate competency score from 72% to 92%+ and qualify for ${profileData.targetCompetency || 'Technical Project Lead'} roles.`
    };
  }

  fallbackTrainerMatch(traineeName, trainerName, trainerExpertise) {
    return {
      matchScore: 92,
      explanation: `${trainerName} specializes in ${Array.isArray(trainerExpertise) ? trainerExpertise.join(', ') : 'Cloud & Software Engineering'}, directly matching the top competency gap areas for ${traineeName}.`,
      keySynergies: ['Direct domain overlap', 'Proven mentorship track record'],
      recommendedNextStep: 'Schedule introductory consultation session.'
    };
  }
}

module.exports = new AIService();

