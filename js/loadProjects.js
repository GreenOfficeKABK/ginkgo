const baseURL = "http://172.17.25.120:8055"; // Directus API base URL

// Fetch project data
async function loadProjects() {
  try {
    const res = await fetch(`${baseURL}/items/archival_projects?fields=project_name,project_year,artist_name,artist_url,area,tags,description,images.directus_files_id.*&sort=-project_year`);
    const { data } = await res.json();

    const projectsGrid = document.querySelector(".projects-grid");

    data.forEach(project => {
      // Log project name and images
      console.log("Images for project:", project.project_name, project.images);

      const container = document.createElement('div');
      container.classList.add('project-card');
      container.setAttribute('data-tags', project.tags.join(', '));
      container.setAttribute('data-artist', project.artist_name);
      container.setAttribute('data-area', project.area);
      container.setAttribute('data-date', project.project_year);

      // Use explicit imageUrl variable for each image
      let imagesHtml = '';
      if (project.images && project.images.length > 0) {
        imagesHtml = project.images.map(img => {
          const imageUrl = `http://172.17.25.120:8055/assets/${img.directus_files_id?.id || img.directus_files_id}`;
          return `<img src="${imageUrl}" alt="Project Image">`;
        }).join('');
      } else {
        imagesHtml = '<p>No images available</p>';
      }

      container.innerHTML = `
        <div class="project-summary">
          <h3>${project.project_name}</h3>
          <p class="date">${project.project_year}</p>
          <p class="artist"><a href="${project.artist_url}" target="_blank" rel="noopener noreferrer">${project.artist_name}</a></p>
          <p class="area">${project.area}</p>
          <p class="tags">${project.tags.map(tag => `+${tag}`).join(' ')}</p>
        </div>
        <div class="project-details">
          <p>${project.description}</p>
          <div class="project-images">
            ${imagesHtml}
          </div>
        </div>
      `;

      // Add event listener to toggle "expanded" class
      container.addEventListener('click', () => {
        // Close all other expanded project cards
        document.querySelectorAll('.project-card.expanded').forEach(expandedCard => {
          if (expandedCard !== container) {
            expandedCard.classList.remove('expanded');
          }
        });

        container.classList.toggle('expanded');

        // Scroll the project card to the top of the screen when expanded
        if (container.classList.contains('expanded')) {
          const headerOffset = 24; // Adjust this value to match your header height or desired offset
          const cardTop = container.getBoundingClientRect().top + window.pageYOffset;
          const scrollTo = cardTop - headerOffset;
          window.scrollTo({ top: scrollTo, behavior: 'smooth' });
        }
      });

      projectsGrid.appendChild(container);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

async function initializeImageVisualizer() {
  document.querySelectorAll(".project-images img").forEach(img => {
    img.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the project card's click event from triggering

      // Create the modal container
      const modal = document.createElement("div");
      modal.id = "image-viewer-modal";
      modal.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;";

      // Get all images in the current project
      const images = Array.from(img.closest(".project-images").querySelectorAll("img"));
      let currentIndex = images.indexOf(img);

      // Create the image element
      const modalImage = document.createElement("img");
      modalImage.src = img.src;
      modalImage.style = "max-width: 90%; max-height: 90%;";
      modal.appendChild(modalImage);

      // Create left arrow for navigation
      const leftArrow = document.createElement("div");
      leftArrow.innerHTML = "&#8592;";
      leftArrow.style = "position: absolute; left: 20px; font-size: 2rem; color: white; cursor: pointer;";
      leftArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentIndex].src;
      });
      modal.appendChild(leftArrow);

      // Create right arrow for navigation
      const rightArrow = document.createElement("div");
      rightArrow.innerHTML = "&#8594;";
      rightArrow.style = "position: absolute; right: 20px; font-size: 2rem; color: white; cursor: pointer;";
      rightArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        modalImage.src = images[currentIndex].src;
      });
      modal.appendChild(rightArrow);

      // Add keyboard navigation
      const handleKeydown = (e) => {
        if (e.key === "ArrowLeft") {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          modalImage.src = images[currentIndex].src;
        } else if (e.key === "ArrowRight") {
          currentIndex = (currentIndex + 1) % images.length;
          modalImage.src = images[currentIndex].src;
        } else if (e.key === "Escape") {
          modal.remove();
          document.removeEventListener("keydown", handleKeydown);
        }
      };
      document.addEventListener("keydown", handleKeydown);

      // Close the modal when clicking outside the image
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
          document.removeEventListener("keydown", handleKeydown);
        }
      });

      // Append the modal to the body
      document.body.appendChild(modal);
    });
  });
}

// Call the function after loading projects
loadProjects().then(() => {
  if (window.matchMedia('(pointer: fine)').matches) {
    initializeImageVisualizer();
  }
});
