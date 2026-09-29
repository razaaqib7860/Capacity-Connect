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
   * Comprehensive Gemini AI profile & competency gap analysis.
   */
  async generateGapAnalysis(profileData) {
    const prompt = `You are an AI Capacity Building & Competency Coach for the CAPACITY CONNECT platform.
Analyze the following trainee's full professional background:

Name: ${profileData.name}
Highest Qualification: ${profileData.highestQualification} (${profileData.institution})
Current Role: ${profileData.currentRole}
Target Competency: ${profileData.targetCompetency}
Current Skills: ${JSON.stringify(profileData.currentSkills)}
Career Interests: ${JSON.stringify(profileData.careerInterests)}
Resume Summary: ${profileData.resumeText || 'Software Engineer with JavaScript, Python, SQL expertise.'}
LinkedIn: ${profileData.linkedinUrl || 'N/A'}
GitHub: ${profileData.githubUrl || 'N/A'}

Return ONLY valid JSON in this structure:
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
      return this.fallbackGapAnalysis(profileData);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      const text = response.text;
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    } catch (err) {
      console.warn('Gemini API call failed, using rule-based AI fallback:', err.message);
      return this.fallbackGapAnalysis(profileData);
    }
  }

  fallbackGapAnalysis(profileData) {
    return {
      summary: `${profileData.name || 'Candidate'} has strong core fundamentals in Python, JavaScript, and SQL, but shows high priority skill gaps in Cloud Computing, DevOps, and System Design for the ${profileData.targetCompetency || 'Technical Project Lead'} role.`,
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
}

module.exports = new AIService();
