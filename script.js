// 1. Sélection des éléments
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon'); // On cible l'image
const sections = document.querySelectorAll('.section-projets');
const listeProjets = document.querySelectorAll('.projet');
const listeProjetsAcademique = document.querySelectorAll('.projets_academiques .projet');
const listeProjetsPersonnels = document.querySelectorAll('.projets_personnels .projet');
const listeProjetsEnCours = document.querySelectorAll('.projets_en_cours .projet');
const listeTags = document.querySelectorAll('.liste_tags .tags li');
const htmlElement = document.documentElement;

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // On change le chemin de l'image selon le thème
    if (theme === 'dark') {
        themeIcon.src = 'images/moon.png'; // Image pour le mode sombre
        themeIcon.alt = 'Mode Sombre';
    } else {
        themeIcon.src = 'images/sun.png';  // Image pour le mode clair
        themeIcon.alt = 'Mode Clair';
        
    }
}

// 3. Initialisation (Automatique + Sauvegarde)
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    // Si l'utilisateur a déjà fait un choix manuel, on l'utilise
    setTheme(savedTheme);
} else if (systemPrefersDark) {
    // Sinon, on suit les réglages système
    setTheme('dark');
}

// 4. Écouteur de clic pour le bouton
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// 5. Écouteur pour changer en temps réel si l'utilisateur change ses réglages Windows/Mac
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) { // Seulement si l'utilisateur n'a pas forcé de choix
        setTheme(e.matches ? 'dark' : 'light');
    }
});

listeTags.forEach(tagEl => {
    tagEl.addEventListener('click', () => {
        const selectedTag = tagEl.textContent.trim().toLowerCase();
        const isActive = tagEl.classList.contains('active');

        // 1. Reset des tags
        listeTags.forEach(t => t.classList.remove('active'));


        sections.forEach(section => {
            section.querySelectorAll('.projet').forEach(projet => {
                if (isActive) {
                projet.classList.remove('hidden');
                } else {
                    const itemTags = projet.getAttribute('data-tags')?.toLowerCase() || "";
                    if (itemTags.includes(selectedTag)) {
                        projet.classList.remove('hidden');
                    } else {
                        projet.classList.add('hidden');
                    }
                }
            });
        });
        // 2. Filtrage des projets

        if (!isActive) tagEl.classList.add('active');

        

        // 3. Vérification des catégories (La partie que tu cherches)
        updateCategoryVisibility();

        setTimeout(() => {
            updateActiveNavLink();
        }, 100);
    });
});

function updateCategoryVisibility() {
    // On récupère chaque conteneur de section
    

    sections.forEach(section => {
        const projets = section.querySelectorAll('.projet');
        const titre = section.querySelector('.separateur-categorie');
        
        // On vérifie s'il y a au moins un projet qui n'a PAS la classe .hidden
        const hasVisibleProject = Array.from(projets).some(p => !p.classList.contains('hidden'));

        if (hasVisibleProject) {
            titre.classList.remove('hidden');
            // Optionnel : on peut aussi cacher la section entière pour gérer les marges
        } else {
            titre.classList.add('hidden');
        }
    });
}


listeProjets.forEach((projet,index) => {
    const tagsString = projet.getAttribute('data-tags');
    const listeUl = projet.querySelector('.tags'); // La liste vide dans le projet

    if (tagsString && listeUl) {
        // 1. On transforme "Python, JavaScript" en ["Python", "JavaScript"]
        const tagsArray = tagsString.split(',').map(tag => tag.trim());

        // 2. On génère le HTML pour chaque tag
        tagsArray.forEach(tag => {
            const li = document.createElement('li');
            
            // On génère le nom du fichier image (ex: "Python" -> "python.png")
            const imgName = tag.toLowerCase().replace(/\s+/g, ''); 
            
            li.innerHTML = `${tag} <img src="images/${imgName}.png" alt="${tag}">`;
            
            listeUl.appendChild(li);
        });
    }

    // Ajout du séparateur entre les projets
    
});

listeProjetsAcademique.forEach((projet,index) => {
    if (index < listeProjetsAcademique.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'separateur';
            
            // On insère le séparateur juste après le projet actuel
            projet.after(sep);
        }
});

listeProjetsEnCours.forEach((projet,index) => {
    if (index < listeProjetsEnCours.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'separateur';
            
            // On insère le séparateur juste après le projet actuel
            projet.after(sep);
        }
});

listeProjetsPersonnels.forEach((projet,index) => {
    if (index < listeProjetsPersonnels.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'separateur';
            
            // On insère le séparateur juste après le projet actuel
            projet.after(sep);
        }
});

// 1. On sélectionne les sections à surveiller et les liens correspondants
const navLinks = document.querySelectorAll('.profil .liens a');

const observerOptions = {
    root: null,
    rootMargin: '0px 0px -90% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log('Section visible:', entry);
        if (entry.isIntersecting) {
            const id = entry.target.querySelector('.separateur-categorie').getAttribute('id');
            
            
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));


document.querySelectorAll('.profil .liens a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.profil .liens a');
    
    // On cherche la première section qui n'est pas cachée (display != none)
    let sectionVisible = null;
    for (let section of sections) {
        if (section.style.display !== 'none' && !section.classList.contains('hidden')) {
            sectionVisible = section;
            break; // On prend la première qu'on trouve
        }
    }

    if (sectionVisible) {
        const id = sectionVisible.querySelector('.separateur-categorie').getAttribute('id');
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active-link');
            }
        });
    }
}