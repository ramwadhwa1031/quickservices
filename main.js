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
function setLocationSuccess(btn, area, city, region, lat = "", lon = "") {
    const locText = btn.querySelector('.loc-text');
    
    btn.style.background = "#D1FAE5";
    btn.style.borderColor = "#10B981";
    btn.style.color = "#047857";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
    
    if (document.getElementById('latitudeField')) document.getElementById('latitudeField').value = lat;
    if (document.getElementById('longitudeField')) document.getElementById('longitudeField').value = lon;
    if (document.getElementById('modalLat')) document.getElementById('modalLat').value = lat;
    if (document.getElementById('modalLong')) document.getElementById('modalLong').value = lon;
    if (document.getElementById('f_area')) document.getElementById('f_area').value = area || city;
    
    // Build display text: "Area, City" or just "City, State"
    let displayText = "";
    if (area && city && area !== city) {
        displayText = `${area}, ${city}`;
    } else if (area) {
        displayText = `${area}, ${region}`;
    } else {
        displayText = `${city}, ${region}`;
    }
    
    if (locText) locText.innerText = `📍 ${displayText}`;
}

// Function to handle Location Failure properly
function setLocationError(btn) {
    const locText = btn.querySelector('.loc-text');
    btn.style.background = "#FEF2F2";
    btn.style.borderColor = "#EF4444";
    btn.style.color = "#B91C1C";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
    if (locText) locText.innerText = "Location access failed. Enter manually.";
}

// Extract best area name from Nominatim address for Indian locations
function extractAreaFromAddress(addr) {
    // Priority: most granular local area first
    const area = addr.road 
        || addr.neighbourhood 
        || addr.suburb 
        || addr.residential
        || addr.hamlet
        || addr.village
        || addr.city_district
        || "";
    
    const city = addr.city 
        || addr.town 
        || addr.county
        || addr.state_district
        || "";
    
    const region = addr.state || "MH";
    
    return { area, city, region };
}

function detectLocation(btn) {
    const locText = btn.querySelector('.loc-text');
    
    if (locText) locText.innerText = "Detecting location...";
    btn.style.opacity = "0.7";
    btn.style.pointerEvents = "none";

    // 1. Attempt High-Accuracy Browser GPS first
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                if (locText) locText.innerText = "Pinpointing your area...";
                reverseGeocode(btn, lat, lon);
            },
            (error) => {
                console.warn("GPS Denied or Timeout (code: " + error.code + "). Falling back to IP...");
                fetchIPLocation(btn);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        // Browser lacks geolocation
        fetchIPLocation(btn);
    }
}

// Reverse geocode using Nominatim (zoom=18 for street-level)
function reverseGeocode(btn, lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`, {
        headers: {
            'User-Agent': 'QuickCareService/1.0 (https://quickcareservice.com)'
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Nominatim HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            if (data.address) {
                const { area, city, region } = extractAreaFromAddress(data.address);
                if (area || city) {
                    setLocationSuccess(btn, area, city, region, lat, lon);
                } else {
                    // Nominatim returned address but no useful fields — try fallback
                    reverseGeocodeFallback(btn, lat, lon);
                }
            } else {
                // No address in response — try fallback
                reverseGeocodeFallback(btn, lat, lon);
            }
        })
        .catch(err => {
            console.error("Nominatim failed:", err);
            reverseGeocodeFallback(btn, lat, lon);
        });
}

// Fallback: BigDataCloud free reverse geocoding (excellent for India)
function reverseGeocodeFallback(btn, lat, lon) {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(res => {
            if (!res.ok) throw new Error("BigDataCloud HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            const area = data.locality || data.city || "";
            const city = data.city || data.principalSubdivision || "";
            const region = data.principalSubdivision || "MH";
            if (area || city) {
                setLocationSuccess(btn, area, city, region, lat, lon);
            } else {
                setLocationSuccess(btn, "", "Pune Area", "MH", lat, lon);
            }
        })
        .catch(err => {
            console.error("BigDataCloud also failed:", err);
            // Last resort: just show coordinates
            setLocationSuccess(btn, "", "Pune Area", "MH", lat, lon);
        });
}

// IP-based location fallback (no GPS available)
function fetchIPLocation(btn) {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => {
            const city = data.city || "Pune Area";
            const region = data.region || "MH";
            setLocationSuccess(btn, "", city, region, data.latitude, data.longitude);
        })
        .catch(err => {
            console.error("IP Geocoding completely failed:", err);
            setLocationError(btn);
        });
}
