// Feature flag configuration
export const features = {
  // Core features (always enabled)
  projects: true,
  comments: true,
  creatorQuestions: true,
  userProfiles: true,
  authentication: true,
  
  // Optional features (can be toggled)
  notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  enhancedComments: false, // Editing/deletion not yet stable
  
  // Future features (disabled by default)
  qnaSystem: false,
  reputationSystem: false,
  pluginIntegration: false,
  
  // Development features
  debugMode: process.env.NODE_ENV === 'development',
  verboseLogging: process.env.NODE_ENV === 'development',
} as const

// Feature flag checker
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature]
}

// Development helper to list all features
export function getFeatureStatus(): Record<string, boolean> {
  return { ...features }
}

// Safe feature wrapper
export function withFeature<T>(
  feature: keyof typeof features,
  enabled: () => T,
  disabled: () => T = () => null as T
): T {
  return isFeatureEnabled(feature) ? enabled() : disabled()
}