// Reusable validation middleware
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if(!result.success) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten()
    });
  }
  req.validated = result.data;
  next();
};

// Usage: app.post('/api/v1/devices', validate(deviceSchema), handler)
