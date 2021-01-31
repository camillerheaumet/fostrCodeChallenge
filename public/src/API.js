class API{
  static getRecipes(){
      return fetch('http://localhost:3000/recipes')
          .then(respond => respond.json())
  }
}