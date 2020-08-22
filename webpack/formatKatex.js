document.querySelectorAll("script[type='math/tex']").forEach((inlineLatex) => {
  const inlineEquationElement = document.createElement('span');
  inlineEquationElement.className = 'inline-equation';
  inlineEquationElement.innerHTML = katex.renderToString(inlineLatex.textContent);
  inlineLatex.replaceWith(inlineEquationElement);
});

document.querySelectorAll("script[type='math/tex; mode=display']").forEach((blockLatex) => {
  const blockEquationElement = document.createElement('div');
  blockEquationElement.className = 'block-equation';
  blockEquationElement.innerHTML = katex.renderToString('\\displaystyle ' + blockLatex.textContent);
  blockLatex.replaceWith(blockEquationElement);
});
