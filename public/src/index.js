document.addEventListener("DOMContentLoaded", function() {
  const allRecipes = []
  const recipeContainerEl = document.querySelector('.recipe-container')
  const recipeDetailsContainerEl = document.querySelector('.recipe-details-container')
  const searchInput = document.querySelector('.recipe-search-input')
  let searchFilter = document.querySelector('.recipe-search-filter-select')

  function showRecipesList(recipes){
    recipes.forEach(recipe => {
        const recipeNewEl = document.createElement('div')
        
        recipeNewEl.className = 'recipe-card'
        recipeNewEl.innerHTML = `<h2 class="title">${recipe.title}</h2>
          <div class="tags">
            ${recipe.tags.map(tag => `<p class="tag">${tag.toUpperCase()}</p>`).join('')}
          </div>
          ${getRecipeTime(recipe)}
          <p class="servings"><span>Portions:</span> ${recipe.servings}</p>
          <p class="description"><span>Description:</span> ${recipe.description}</p>
          <p class="author"><span>By:</span> ${recipe.author.name}</p>
          `

        recipeContainerEl.appendChild(recipeNewEl)

        recipeNewEl.addEventListener('click', event => {
          showRecipeDetails(recipe)
        })
      });
  }

  function showRecipeDetails(recipe){
    const detailsEl = document.createElement('div')

    recipeDetailsContainerEl.style.display = "block";

    detailsEl.className = 'recipe-details'
    detailsEl.innerHTML = `<div class="close"></div>
      <h2 class="title">${recipe.title}</h2>
      <div class="tags">
        ${recipe.tags.map(tag => `<p class="tag">${tag.toUpperCase()}</p>`).join('')}
      </div>
      ${getRecipeTime(recipe)}
      <div class="servings-container">
        <p class="servings"><span>Portions:</span></p>
        <div class="recipe-details-quantity">
          <select class="recipe-details-quantity-select">
            <option value="1">${recipe.servings}</option>
            <option value="2">${recipe.servings * 2}</option>
            <option value="3">${recipe.servings * 3}</option>
          </select>
        </div>
      </div>
      <p class="description"><span>Description:</span> ${recipe.description}</p>
      <div class="ingredients-container">
        ${getRecipeIngredients(recipe, 1)}
      </div>
      <div class="directions">
        <span>Directions:</span><br/>
        <div class="steps">
          ${recipe.directions.map((direction, idx) => `<p class="step"><span>Step ${idx + 1}:</span><br/>${direction}</p>`).join('')}
        </div>
      </div>
      <p class="author"><span>By:</span> <a href="${recipe.author.url}">${recipe.author.name}</a></p>
      `
    
    recipeDetailsContainerEl.appendChild(detailsEl)
  
    const closeEl = document.querySelector('.close')
    closeEl.addEventListener('click', event => {
      recipeDetailsContainerEl.innerHTML = ''
      recipeDetailsContainerEl.style.display = "none";
    })

    const quantityEl = document.querySelector('.recipe-details-quantity-select')
    const ingredientsContainerEl = document.querySelector('.ingredients-container')
    quantityEl.addEventListener('change', event => {
      const multiplier = quantityEl.value
      ingredientsContainerEl.innerHTML = getRecipeIngredients(recipe, multiplier)
    })
  }

  function getRecipeTime(recipe) {
    const prep = recipe.prep_time_min ? recipe.prep_time_min : 0;
    const cook = recipe.cook_time_min ? recipe.prep_time_min : 0;
    const total = prep + cook

    if (total > 0) {
      return `<div class="times">
          <p class="totalTime"><span>Total Time:</span><br/>${total} mins</p>
          <p class="prepTime"><span>Prep Time:</span><br/>${prep} mins</p>
          <p class="cookTime"><span>Cook Time:</span><br/>${cook} mins</p>
        </div>`
    }
    return ''
  }

  function getRecipeIngredients(recipe, multiplier) {
    return `<span>Ingredients:</span><br/>
      <ul class="ingredients">
        ${recipe.ingredients.map(ingredient => {
          const regex = /[0-9]+[\s][0-9]*[/|.][0-9]+|[0-9]+[/|.][0-9]+|[0-9]+[\s](?!inches)+/g
          const quantities = ingredient.match(regex)

          let finalIngredient = ingredient;

          if (quantities && quantities.length > 0) {
            quantities.forEach(quantity => {
              let newQuantity = quantity.split(' ').filter(r => r !== '').reduce((acc, curr) => {
                if(curr.includes('/')) {
                  let currArr = curr.split('/')
                  return ((multiplier * currArr[0]) / currArr[1]) + acc
                }
                return (multiplier * curr) + acc
              }, 0)
              finalIngredient = finalIngredient.replace(quantity, `${numberToFraction(newQuantity)} `)

            })
          }

          return `<li>${finalIngredient}</li>`
        }).join('')}
      </ul>`
  }

  searchInput.addEventListener('input', event => {
    let inputValue = searchInput.value

    recipeContainerEl.innerHTML = ''

    if (searchFilter.value === 'title') {
      showRecipesList(allRecipes.filter(recipe => recipe.title.toLowerCase().includes(inputValue.toLowerCase())))
    } else {
      showRecipesList(allRecipes.filter(recipe => recipe[searchFilter.value].some(r => r.toLowerCase().includes(inputValue.toLowerCase()))))
    }

  })

  searchFilter.addEventListener('change', event => {
    searchInput.value = ''
    showRecipesList(allRecipes)
  })

  API.getRecipes().then(recipes => {
    Object.keys(recipes).forEach(recipeKey => {
      allRecipes.push(recipes[recipeKey])
    })
  }).then(() => showRecipesList(allRecipes))
});


var numberToFraction = function( amount ) {
	if ( parseFloat( amount ) === parseInt( amount ) ) {
		return amount;
	}

	var gcd = function(a, b) {
		if (b < 0.0000001) {
			return a;
		}
		return gcd(b, Math.floor(a % b));
	};
	var len = amount.toString().length - 2;
	var denominator = Math.pow(10, len);
	var numerator = amount * denominator;
	var divisor = gcd(numerator, denominator);
	numerator /= divisor;
	denominator /= divisor;
	var base = 0;

	if ( numerator > denominator ) {
		base = Math.floor( numerator / denominator );
		numerator -= base * denominator;
	}
	amount = Math.floor(numerator) + '/' + Math.floor(denominator);
	if ( base ) {
		amount = base + ' ' + amount;
	}
	return amount;
};