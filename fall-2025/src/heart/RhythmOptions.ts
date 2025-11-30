export interface RhythmOption {
    value: string;  
    label: string;  
}

export interface RhythmGroups {
    [location: string]: RhythmOption[];
}

export const rhythmGroups: RhythmGroups = {
    mitral: [
        { value: "Apex Normal S1 S2", label: "Mitral Normal S1 S2" },
        { value: "Apex S3 Gallop", label: "Mitral S3 Gallop" },
        { value: "Apex S4 Gallop", label: "Mitral S4 Gallop" },
        { value: "Apex Mid-Systolic Click", label: "Mitral Mid-Systolic Click" },
        { value: "Apex Early Systolic Murmur", label: "Mitral Early Systolic Murmur" },
        { value: "Apex Mid-Systolic Murmur", label: "Mitral Mid-Systolic Murmur" },
        { value: "Apex Late Systolic Murmur", label: "Mitral Late Systolic Murmur" },
        { value: "Apex Click w/ Late Systolic Murmur", label: "Mitral Click w/ Late Systolic Murmur" },
    ], 
    aortic: [
        { value: "Aortic Normal S1 S2", label: "Aortic Normal S1 S2" },
        { value: "Aortic S3 Gallop", label: "Aortic S3 Gallop" },
        { value: "Aortic S4 Gallop", label: "Aortic S4 Gallop" },
        { value: "Aortic Mid-Systolic Click", label: "Aortic Mid-Systolic Click" },
        { value: "Aortic Early Systolic Murmur", label: "Aortic Early Systolic Murmur" },
        { value: "Aortic Mid-Systolic Murmur", label: "Aortic Mid-Systolic Murmur" },
        { value: "Aortic Late Systolic Murmur", label: "Aortic Late Systolic Murmur" },
        { value: "Aortic Click w/ Late Systolic Murmur", label: "Aortic Click w/ Late Systolic Murmur" },
    ], 
    pulmonic: [
        { value: "Pulmonic Normal S1 S2", label: "Pulmonic Normal S1 S2" },
        { value: "Pulmonic S3 Gallop", label: "Pulmonic S3 Gallop" },
        { value: "Pulmonic S4 Gallop", label: "Pulmonic S4 Gallop" },
        { value: "Pulmonic Mid-Systolic Click", label: "Pulmonic Mid-Systolic Click" },
        { value: "Pulmonic Early Systolic Murmur", label: "Pulmonic Early Systolic Murmur" },
        { value: "Pulmonic Mid-Systolic Murmur", label: "Pulmonic Mid-Systolic Murmur" },
        { value: "Pulmonic Late Systolic Murmur", label: "Pulmonic Late Systolic Murmur" },
        { value: "Pulmonic Click w/ Late Systolic Murmur", label: "Pulmonic Click w/ Late Systolic Murmur" },
    ],
    tricuspid: [
        { value: "Tricuspid Normal S1 S2", label: "Tricuspid Normal S1 S2" },
        { value: "Tricuspid S3 Gallop", label: "Tricuspid S3 Gallop" },
        { value: "Tricuspid S4 Gallop", label: "Tricuspid S4 Gallop" },
        { value: "Tricuspid Mid-Systolic Click", label: "Tricuspid Mid-Systolic Click" },
        { value: "Tricuspid Early Systolic Murmur", label: "Tricuspid Early Systolic Murmur" },
        { value: "Tricuspid Mid-Systolic Murmur", label: "Tricuspid Mid-Systolic Murmur" },
        { value: "Tricuspid Late Systolic Murmur", label: "Tricuspid Late Systolic Murmur" },
        { value: "Tricuspid Click w/ Late Systolic Murmur", label: "Tricuspid Click w/ Late Systolic Murmur" },
    ]
    
};