import { z } from 'zod';
export const validateRegisterInput = (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const errors: any = {};
    let isValid = true;
  
    if (!data.username || data.username.trim() === '') {
      errors.username = 'Username is required';
      isValid = false;
    }
  
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
  
    if (!data.password || data.password === '') {
      errors.password = 'Password is required';
      isValid = false;
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
  
    return { errors, isValid };
  };
  
  export const validateBlogInput = (data: {
    title: string;
    content: string;
  }) => {
    const errors: any = {};
    let isValid = true;
  
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    }
  
    if (!data.content || data.content.trim() === '') {
      errors.content = 'Content is required';
      isValid = false;
    }
    
    return { errors, isValid };
  };

  export const validateLoginInput = (data: {
    email: string;
    password: string;
  }): ValidationResult => {
    const errors: Record<string, string> = {};
    let isValid = true;
  
    // Email validation
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
  
    // Password validation
    if (!data.password || data.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
  
    return { errors, isValid };
  };


  export const commentSchema = z.object({
    content: z.string()
      .min(1, 'Comment must be at least 1 character')
      .max(1000, 'Comment cannot exceed 1000 characters'),
    blogId: z.string().min(1, 'Blog ID is required')
  });
  
  export const validateComment = (data: unknown) => {
    const result = commentSchema.safeParse(data);
    
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
        isValid: false
      };
    }
  
    return {
      errors: null,
      isValid: true
    };
  };

  export type CommentFormData = z.infer<typeof commentSchema>;
  export interface ValidationResult {
    errors: Record<string, string>;
    isValid: boolean;
  }


  