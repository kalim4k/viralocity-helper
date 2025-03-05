
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b2bbaf14b5eb41afa10b345c2ac581d5',
  appName: 'viralocity-helper',
  webDir: 'dist',
  server: {
    url: 'https://b2bbaf14-b5eb-41af-a10b-345c2ac581d5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    }
  }
};

export default config;
