import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/font-word-generator/'
})
```

The key part is `base: '/font-word-generator/'` - this tells Vite where the app will be hosted.

**Save it (Cmd + S)**

**Then in GitHub Desktop:**
1. Commit message: `Fix base path for GitHub Pages`
2. Click **Commit to main**
3. Click **Push origin**

**Wait for the yellow dot to turn green again (2-3 minutes)**

Then try the URL:
```
https://katesartanddesign.github.io/font-word-generator/