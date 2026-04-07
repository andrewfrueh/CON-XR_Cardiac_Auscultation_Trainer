import { defineConfig } from 'vite'

export default defineConfig({
    base: "/CON-XR_Cardiac_Auscultation_Trainer/", // for our GitHub actions to be happy
    // ^ IDEALLY make this a build option in the pipeline so we can refer to the proper github repo name in case it changes
    build: {
        // To match our GitHub pages repo
        outDir: "docs",
    }
})
