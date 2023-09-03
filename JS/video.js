// Step 0: Calling the main function with DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // document object represents the entire HTML document.
    // Note: The "DOMContentLoaded" event signals that the DOM (Document Object Model) tree is ready and you can safely interact with and manipulate the content of the web page.
    //  It means HTML document has been completely loaded and parsed, but external resources like images and stylesheets may still be downloading.

    // Step1: I Called all the variables with "Let". It will help to change data in future code
    let currentCategory = "All";
    let videosData = [];
    let categoriesData = [];
    // Step 2: Making function to call all button in the recpect of their Ids as , 
    // declaring constant variable called buttons and assigns it an array of strings
    function highlightButton(buttonId) {
        const buttons = ["allBtn", "musicBtn", "comedyBtn", "drawingBtn", "sortByView"];
        buttons.forEach((btn) => {
            if (btn === buttonId) {
                document.getElementById(btn);
            } else {
                document.getElementById(btn);
            }
        });
    }
    // Step 3 : Function called loadCategories() that is responsible for making an HTTP request to a specific API endpoint and loading a list of video categories. 
    function loadCategories() {
        fetch("https://openapi.programming-hero.com/api/videos/categories")
            // By using 'fetch()' I am requesting data from the API "https://openapi.programming-hero.com/api/videos/categories" endpoint, which is expected to return information about video categories.
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    // I used condition if the data object has a "status property" that evaluates to a truthy value. If the status property is present and evaluates to true, it proceeds with the next line.
                    categoriesData = data.data;
                }
                // Once the JSON response is successfully parsed, I used another .then() block is used to handle the data. 
            })
            .catch((error) => {
                // If any errors occur during the HTTP request or data processing, this block catches the error and handles it. It logs an error message to the console using
                console.error('Error fetching categories:', error);
            });
    }
    // Step4: fro loading the video using API link
    function loadVideos(categoryId) {
        document.getElementById("videoContainer").innerHTML = "";

        fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    videosData = data.data;
                    videosData.forEach((video) => {
                        createVideoCard(video);
                    });
                } else {
                    document.getElementById("noContentMessage").classList.remove("hidden");
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    // Load categories when the page initially loads
    loadCategories();

    // To Load all the videos when the page initially loads I added this ,I used Ctaegory_id 1000 for this.
    loadVideos("1000");
    highlightButton("allBtn");

    document.getElementById("allBtn").addEventListener("click", () => {
        currentCategory = "All";
        // to load the videos of this category
        loadVideos(getCategoryId("All"));
        // To highlight after I clicked the button of this category
        highlightButton("allBtn");
    });

    document.getElementById("musicBtn").addEventListener("click", () => {
        currentCategory = "Music";
        loadVideos(getCategoryId("Music"));
        highlightButton("musicBtn");
    });

    document.getElementById("comedyBtn").addEventListener("click", () => {
        currentCategory = "Comedy";
        loadVideos(getCategoryId("Comedy"));
        highlightButton("comedyBtn");
    });

    document.getElementById("drawingBtn").addEventListener("click", () => {
        currentCategory = "Drawing";
        loadVideos(getCategoryId("Drawing"));
        highlightButton("drawingBtn");
    });
    // Step5: Here I did sorting part of an array(videosData) of video data objects based on the number of views each video has

    //  
    // 
    // iv. 

    document.getElementById("sortByView").addEventListener("click", () => {
        // note: i. sort()is being called on the "videosData" array.I used it to sort the elements of an array in place, meaning it will modify the original array
        videosData.sort((a, b) => {
            // Note ii. sort((a, b) => is an array fucntion here I took two parameters, a and b, which represent two elements (video data objects) being compared during the sorting process.
            // iii. "a.others.views" and "b.others.views" access the "views" property of the a and b objects
            const viewsA = parseInt(a.others.views.replace(/[^0-9]/g, ''), 10);
            const viewsB = parseInt(b.others.views.replace(/[^0-9]/g, ''), 10);
            // note: parseInt(a.others.views.replace(/[^0-9]/g, ''), 10) and parseInt(b.others.views.replace(/[^0-9]/g, ''), 10) 
            // are used to convert the "views" values from strings to integers.
            // .replace(/[^0-9]/g, '') part of the code is a regular expression that removes all non-digit characters 
            // from the "views" strings. This ensures that the sorting is based on the numeric value of views, even if the views are formatted with commas or other non-numeric characters.
            return viewsB - viewsA;
            // note:"return viewsB - viewsA; " is used to determine the order of sorting. 
            // By subtracting viewsA from viewsB, the code sorts the videos in descending order of views, 
            // meaning videos with more views will appear first in the sorted array.
        });

        const videoContainer = document.getElementById("videoContainer");
        videoContainer.innerHTML = "";

        videosData.forEach((video) => {
            createVideoCard(video);
        });

        highlightButton("sortByView");
    });

    // Function for video cards
    function createVideoCard(video) {
        const videoContainer = document.getElementById("videoContainer");
        const videoCard = document.createElement("div");
        videoCard.className = "card w-96 bg-base-100";
        // Html part for the card design
        videoCard.innerHTML = `
        
        <figure>
            <img src="${video.thumbnail}" class="lg:w-auto h-52" />
        </figure>
        <div class="card-body">
            <div class="flex items-start">
                <img src="${video.authors[0].profile_picture}" alt="" class="w-10 h-10 rounded-full mr-3 relative">
                <div>
                    <p class="font-bold text-lg">${video.title}</p>
                    <div class="grid grid-cols-2">
                        <p class="text-sm">${video.authors[0].profile_name}</p>
                        <p id="author-verified">${blueTick(video.authors[0].verified)}</p>
                    </div>
                    <p class="text-sm">${video.others.views}</p>
                    <p class="bg-black text-white text-sm absolute px-1.5 ml-36 -mt-36">${formatPostedDate(video.others.posted_date)}</p>
                </div>
            </div>
        </div>
        `;

        videoContainer.appendChild(videoCard);
    }
    // Here I did math part for showing the time
    function formatPostedDate(apiTime) {
        const secondsAgo = parseInt(apiTime);
        if (isNaN(secondsAgo)) {
            return "";
        }
        const hours = Math.floor(secondsAgo / 3600);
        const minutes = Math.floor((secondsAgo % 3600) / 60);
        const seconds = secondsAgo % 60;

        let formattedTime = "";
        if (hours > 0) {
            formattedTime += hours + "h ";
        }
        if (minutes > 0) {
            formattedTime += minutes + "min ";
        }
        formattedTime += seconds + "s ago";

        return formattedTime;
    }

    // Here is the function to check if the author is verified and add a blue tick
    function blueTick(verified) {
        if (verified === true) {
            return '<img class="mr-2.5" src="./images/blue_tick.svg" alt="Verified">';
        } else {
            return '';
        }
    }

    // Function to get category ID from category name
    function getCategoryId(categoryName) {
        const category = categoriesData.find((cat) => cat.category === categoryName);
        // Default to "All" category if not found
        return category ? category.category_id : "1000";
    }
});
