const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector('[name=productId]').value
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value

  fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
    headers: { 'csrf-token': csrfToken }
  })
    .then(result => console.log(result))
    .catch(err => console.log(err))
}
