$components = @(
    'AboutSection', 'CodeShowcase', 'ContactSection', 
    'FaqSection', 'Footer', 'HeroSection', 'Navbar', 
    'ProjectModal', 'ProjectsSection', 'ServicesSection', 
    'SkillsSection', 'TestimonialsSection', 'TimelineSection'
)

foreach ($c in $components) {
    $dir = "c:\laragon\www\portofolio\src\components\$c"
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    $oldJsx = "c:\laragon\www\portofolio\src\components\$c.jsx"
    $newJsx = "$dir\index.jsx"
    $oldCss = "c:\laragon\www\portofolio\src\components\$c.css"
    $newCss = "$dir\style.css"
    
    if (Test-Path $oldJsx) {
        Move-Item -Path $oldJsx -Destination $newJsx
    }
    if (Test-Path $oldCss) {
        Move-Item -Path $oldCss -Destination $newCss
    }
    
    if (Test-Path $newJsx) {
        $content = Get-Content -Path $newJsx -Raw
        # Replace CSS import
        $content = $content -replace "import '\./$c\.css';", "import './style.css';"
        
        # Replace data import
        $content = $content -replace "import \{ portfolioData \} from '\.\./data/portfolioData';", "import { portfolioData } from '../../data/portfolioData';"
        
        # Replace local component imports (like ProjectModal)
        $content = $content -replace "import (.*?) from '\./(.*?)';", 'import $1 from ''../$2'';'
        
        Set-Content -Path $newJsx -Value $content
    }
}

Write-Output "Components organized successfully."
