// formValidation.ts

import type { RootState } from "@/Slice/Store"

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export const validatePersonalInfo = (data: RootState['recruiterRegister']): ValidationResult => {
  const errors: Record<string, string[]> = {}

  // Required fields for personal information
  const requiredFields = {
    firstName: 'First Name',
    lastName: 'Last Name',
    title: 'Title',
    one_liner_intro: 'One Liner Introduction',
    number: 'Phone Number',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    date_of_birth: 'Date of Birth',
    gender: 'Gender',
    introduction: 'Introduction',
    photo: 'Photo'
  }

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!data[field as keyof typeof data]) {
      errors[field] = [`${label} is required`]
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateEducation = (data: RootState['recruiterRegister']): ValidationResult => {
  const errors: Record<string, string[]> = {}

  // Validate 10th standard education
  const validateSchoolEducation = (education: any, prefix: string) => {
    const requiredFields = {
      school_name: 'School Name',
      percentage_obtained: 'Percentage',
      year_of_passing: 'Year of Passing',
      school_board: 'School Board'
    }

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!education[field]) {
        errors[`${prefix}_${field}`] = [`${label} is required`]
      }
    })
  }

  validateSchoolEducation(data.tenth_standard_education, '10th')
  validateSchoolEducation(data.twelth_standard_education, '12th')

  // Validate college education
  data.college_education.forEach((education, index) => {
    const requiredFields = {
      programme_name: 'Programme Name',
      specialization: 'Specialization',
      college_name: 'College Name',
      university_name: 'University Name',
      cgpa: 'CGPA',
      duration: 'Duration',
      year_of_commencement: 'Year of Commencement',
      year_of_passing: 'Year of Passing'
    }

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!education[field as keyof typeof education]) {
        errors[`college_${index}_${field}`] = [`${label} is required for College ${index + 1}`]
      }
    })
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateSkillsAndExperience = (data: RootState['recruiterRegister']): ValidationResult => {
  const errors: Record<string, string[]> = {}

  // Validate internship experience
  data.internship_experience.forEach((internship, index) => {
    const requiredFields = {
      date_of_commencement: 'Date of Commencement',
      date_of_conclusion: 'Date of Conclusion',
      company: 'Company',
      duration: 'Duration',
      roles_and_responsibilities: 'Roles and Responsibilities',
      stipend: 'Stipend'
    }

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!internship[field as keyof typeof internship]) {
        errors[`internship_${index}_${field}`] = [`${label} is required for Internship ${index + 1}`]
      }
    })
  })

  // Validate work experience
  data.work_experience.forEach((work, index) => {
    const requiredFields = {
      company: 'Company',
      designation: 'Designation',
      date_of_commencement: 'Date of Commencement',
      date_of_resignation: 'Date of Resignation',
      duration_of_service: 'Duration of Service',
      job_description: 'Job Description',
      annual_ctc: 'Annual CTC'
    }

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!work[field as keyof typeof work]) {
        errors[`work_${index}_${field}`] = [`${label} is required for Work Experience ${index + 1}`]
      }
    })
  })

  // Validate core skills
  if (data.core_skills.length === 0 || data.core_skills.some(skill => !skill.trim())) {
    errors.core_skills = ['At least one skill is required']
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validatePresentJob = (data: RootState['recruiterRegister']): ValidationResult => {
  const errors: Record<string, string[]> = {}

  const requiredFields = {
    company: 'Company',
    current_role: 'Current Role',
    job_description: 'Job Description',
    date_of_commencement: 'Date of Commencement',
    years_of_experience: 'Years of Experience'
  }

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!data.current_job[field as keyof typeof data.current_job]) {
      errors[field] = [`${label} is required`]
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
