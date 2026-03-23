document.addEventListener("DOMContentLoaded", () => {
    
    // --- Initialize AOS ---
    if(typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            once: true,
            easing: 'ease-out-cubic',
            offset: 80
        });
    }

    // --- Hero Background Slider ---
    if(typeof Swiper !== "undefined") {
        const heroBgSwiper = new Swiper('.hero-swiper', {
            loop: true,
            effect: "fade",
            allowTouchMove: false,
            speed: 2000, 
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }

    // --- Sticky Header Logic ---
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 40) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- Advanced Dual-Tab Modal Logic ---
    const queryModal = document.getElementById('queryModal');
    const closeModal = document.getElementById('closeModal');
    const tabs = document.querySelectorAll('.modal-tab');
    const panels = document.querySelectorAll('.modal-panel');
    
    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add to clicked
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    if (queryModal) {
        // Auto pop-up Lead Box
        setTimeout(() => {
            if (!sessionStorage.getItem('vibrantModalShown')) {
                queryModal.classList.add('active');
                sessionStorage.setItem('vibrantModalShown', 'true');
            }
        }, 3000);

        if (closeModal) {
            closeModal.addEventListener('click', () => queryModal.classList.remove('active'));
        }
        // Close on outside click
        queryModal.addEventListener('click', (e) => {
            if (e.target === queryModal) queryModal.classList.remove('active');
        });
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other faqs
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

});

// --- HTML5 Geolocation API ---
// Function to update the Location Data visibly
function setLocationSuccess(city, region, lat = "", lon = "") {
    const locBtn = document.querySelector('.location-btn');
    const locText = document.getElementById('locText');
    
    locBtn.style.background = "#D1FAE5";
    locBtn.style.borderColor = "#10B981";
    locBtn.style.color = "#047857";
    locBtn.style.opacity = "1";
    locBtn.style.pointerEvents = "auto";
    
    if (document.getElementById('latitudeField')) document.getElementById('latitudeField').value = lat;
    if (document.getElementById('longitudeField')) document.getElementById('longitudeField').value = lon;
    if (document.getElementById('f_area')) document.getElementById('f_area').value = city;
    
    locText.innerText = `Secured: ${city}, ${region}`;
}

// Function to handle Location Failure properly
function setLocationError() {
    const locBtn = document.querySelector('.location-btn');
    const locText = document.getElementById('locText');
    locBtn.style.background = "#FEF2F2";
    locBtn.style.borderColor = "#EF4444";
    locBtn.style.color = "#B91C1C";
    locBtn.style.opacity = "1";
    locBtn.style.pointerEvents = "auto";
    locText.innerText = "Location access failed. Enter manually.";
}

function detectLocation() {
    const locBtn = document.querySelector('.location-btn');
    const locText = document.getElementById('locText');
    
    locText.innerText = "Connecting to Satellite...";
    locBtn.style.opacity = "0.7";
    locBtn.style.pointerEvents = "none";

    // 1. Attempt High-Accuracy Browser GPS first
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Reverse geocode via Nominatim OSM (Ensuring English output)
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1&accept-language=en`)
                    .then(res => res.json())
                    .then(data => {
                        let city = "";
                        if (data.address) {
                            // Extract exact, granular local area
                            city = data.address.suburb || data.address.neighbourhood || data.address.residential || data.address.city_district || data.address.city || data.address.town || "Pune Area";
                        } else {
                            city = "Pune Area";
                        }
                        const region = data.address ? (data.address.state || "MH") : "MH";
                        setLocationSuccess(city, region, lat, lon);
                    })
                    .catch(err => {
                        console.error("Nominatim Reverse Geocoding failed:", err);
                        // Network error on reverse geocoding -> Try IP
                        fetchIPLocation();
                    });
            },
            (error) => {
                console.warn("GPS Denied or Timeout. Falling back to IP...");
                fetchIPLocation();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        // Browser lacks geolocation
        fetchIPLocation();
    }
}

// 2. IP Fallback
function fetchIPLocation() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => {
            const city = data.city || "Pune Area";
            const region = data.region || "MH";
            setLocationSuccess(city, region, data.latitude, data.longitude);
        })
        .catch(err => {
            console.error("IP Geocoding completely failed:", err);
            setLocationError();
        });
}
