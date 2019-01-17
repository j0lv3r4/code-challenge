(function() {
    let state = { 
        rendered: false,
        cart: [],
        products: {
            "0001": {
                title: 'Product title 0001',
                content: 'Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue.',
                img: 'https://api.adorable.io/avatars/235/0001@adorable.png'
            },
            "0002": {
                title: 'Product title 0002',
                content: 'Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum.',
                img: 'https://api.adorable.io/avatars/235/0002@adorable.png'
            },
            "0003": {
                title: 'Product title 0003',
                content: 'Donec id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
                img: 'https://api.adorable.io/avatars/235/0003@adorable.png'
            }
        }
    }

    const productImage = document.getElementsByClassName('gumroad-product-image')[0];
    const productTitle = document.getElementsByClassName('gumroad-product-title')[0];
    const productContent = document.getElementsByClassName('gumroad-product-content')[0];
    const productButton = document.getElementsByClassName('gumroad-buy')[0];
    const productClose = document.getElementsByClassName('gumroad-close')[0];

    /**
     * Updates the state avoiding mutation
     * @param {object} newState 
     */
    const updateState = newState => {
        state = Object.assign({}, state, newState);
    }

    /**
     * Updates the cart in the state and calls callback function
     * @param {object} param0 Object containing the title and productId
     * @param {function} callback Function to call after the state update
     */
    const updateCart = ({ title, productId }, callback) => {
        const cart = [].concat(state.cart, [{ title, productId }]);
        updateState({ cart });
        callback();
    }

    /**
     * Renders the cart element with the list of strings from `state.cart`
     */
    const renderCart = () => {
        const productList = document.getElementsByClassName('product-list')[0];
        const listHTML = state.cart.map(({ title, productId }) => `<li class="product-item" attr-product-id="${productId}">${title}</li>`).join('');
        productList.innerHTML = listHTML;
    }

    /**
     * Renders the Popup UI with title, image and content. Also populates the
     * buy button with metadata
     * @param {object} data 
     */
    const renderPopup = data => {
        const { title, content, img } = state.products[data.productId];
        productImage.setAttribute('src', img);
        productTitle.innerHTML = title;
        productContent.innerHTML = content;
        productButton.setAttribute('data-product-id', data.productId);
        productButton.setAttribute('data-product-title', title);

        if (!state.rendered) {
            updateState({ rendered: true });
            productButton.addEventListener('click', event => {
                const { productId, productTitle } = event.target.dataset;
                updateCart({ title: productTitle, productId }, () => renderCart());
            })
        }

        productClose.addEventListener('click', event => {
            const message = JSON.stringify({ event: 'close' });
            window.parent.postMessage(message, 'https://gumroad-code-challenge-main.now.sh');
        });
    }

    window.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        renderPopup(data);
    }, false)
})()