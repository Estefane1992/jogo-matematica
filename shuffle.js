function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
  
    //Enquanto restarem elementos para embaralhar...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      //troque-o com o elemento atual.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  