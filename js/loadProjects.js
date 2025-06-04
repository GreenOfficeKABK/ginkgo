const baseURL = "http://172.17.25.120:8055"; // Directus API base URL

// Fetch project data
async function loadProjects() {
  try {
    const res = await fetch(`${baseURL}/items/archival_projects?fields=project_name,project_year,artist_name,artist_url,area,tags,description,images.*&sort=-project_year`);
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
            ${project.images.map(img => `<img src="${baseURL}/assets/${img.directus_files_id.id}" alt="Project Image">`).join('')}
          </div>
        </div>
      `;

      // Add event listener to toggle "expanded" class
      container.addEventListener('click', () => {
        container.classList.toggle('expanded');
      });

      projectsGrid.appendChild(container);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

loadProjects();
