const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const recommendationsContainer = document.getElementById('recommendationsContainer');
const popularContainer = document.getElementById('popularContainer');
const resultsHeader = document.getElementById('resultsHeader');

// Load popular destinations on start
window.addEventListener('load', () => {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Data loaded successfully:', data);
            const popular = [
                data.beaches[0],
                data.temples[1],
                data.countries[0].cities[0],
                data.beaches[2]
            ];
            displayRecommendations(popular, popularContainer);
        })
        .catch(err => {
            console.error('Initial load failed:', err);
        });
});

function searchRecommendations() {
    const input = searchInput.value.toLowerCase().trim();
    if (input === '') {
        recommendationsContainer.innerHTML = '';
        resultsHeader.style.display = 'none';
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            recommendationsContainer.innerHTML = '';
            resultsHeader.style.display = 'block';
            
            let results = [];

            if (input.includes('beach')) {
                results = data.beaches;
            } else if (input.includes('temple')) {
                results = data.temples;
            } else if (input.includes('country') || input.includes('countries')) {
                results = data.countries[0].cities;
            } else {
                const country = data.countries.find(item => item.name.toLowerCase().includes(input));
                if (country) {
                    results = country.cities;
                } else {
                    const beach = data.beaches.find(item => item.name.toLowerCase().includes(input));
                    if(beach) results.push(beach);
                    
                    const temple = data.temples.find(item => item.name.toLowerCase().includes(input));
                    if(temple) results.push(temple);
                }
            }
            
            displayRecommendations(results, recommendationsContainer);
            recommendationsContainer.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            recommendationsContainer.innerHTML = '<p>An error occurred while fetching data.</p>';
        });
}

function displayRecommendations(results, container) {
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No recommendations found for your search.</p>';
        return;
    }

    results.forEach((item, index) => {
        const recommendationDiv = document.createElement('div');
        recommendationDiv.classList.add('recommendation-card');
        recommendationDiv.style.animationDelay = `${index * 0.1}s`;

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('card-img-container');

        const img = document.createElement('img');
        
        // Use a small delay to ensure DOM is ready and force a fresh load
        setTimeout(() => {
            img.src = `${item.imageUrl}&t=${new Date().getTime()}`;
        }, 0);
        
        img.alt = item.name;
        
        img.onload = function() {
            console.log(`Successfully loaded image for ${item.name}`);
        };

        img.onerror = function() {
            console.warn(`Failed to load image for ${item.name}, using fallback.`);
            this.src = `https://images.unsplash.com/photo-1500835597467-f519a7b91ee3?q=80&w=1000&auto=format&fit=crop`; 
            this.onerror = null; 
        };

        imgContainer.appendChild(img);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('card-content');
        
        const title = document.createElement('h3');
        title.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');

        const btn = document.createElement('button');
        btn.textContent = 'Explore Now';
        btn.classList.add('visit-btn');

        cardFooter.appendChild(btn);
        contentDiv.appendChild(title);
        contentDiv.appendChild(description);
        contentDiv.appendChild(cardFooter);

        recommendationDiv.appendChild(imgContainer);
        recommendationDiv.appendChild(contentDiv);

        container.appendChild(recommendationDiv);
    });
}

function clearRecommendations() {
    searchInput.value = '';
    recommendationsContainer.innerHTML = '';
    resultsHeader.style.display = 'none';
}

searchBtn.addEventListener('click', searchRecommendations);
clearBtn.addEventListener('click', clearRecommendations);

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchRecommendations();
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
