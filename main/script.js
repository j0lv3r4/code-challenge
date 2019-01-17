
(function() {
    // UI
    const gumroadButtons = document.body.getElementsByClassName('gumroad-button');

    // Local state
    let state = {
        currentProduct: '',
        iframeUrl: 'https://gumroad-code-challenge-iframe.now.sh',
    }

    // Functions

    /**
     * Updates the state avoiding mutation
     * @param {object} newStat
     * @returns {object}
     */
    const updateState = newState => {
        state = Object.assign({}, state, newState);
        return state
    }

    /**
     * Embeds the Gumroad stylesheet
     */
    const embedGumroadStyle = () => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet') 
        link.setAttribute('href', 'gumroad-styling.css');
        document.head.appendChild(link);
    }


    /**
     * Embeds the add-to-cart iframe and add an event listener to hide
     * id when someone clicks the close button
     */
    const embedIframe = () => {
        const gumroadIframe = document.createElement('iframe');
        gumroadIframe.setAttribute('class', 'gumroad-iframe');
        gumroadIframe.setAttribute('src', state.iframeUrl)
        document.body.appendChild(gumroadIframe);

        window.addEventListener('message', event => {
            if (event.data) {
                const data = JSON.parse(event.data);
                if (data.event && data.event === 'close') {
                    gumroadIframe
                        .style.display = 'none';
                }
            }
        })
    }

    /**
     * Grabs the attribute data from each button then creates a message `Object`
     * and send it over to the iframe using `postMessage`
     * @param {object} event 
     */
    const updateIframe = event => {
        const { productId, button, embed } = event.target.dataset;

        // We don't do anything if user is hovering the same button
        if (state.currentProduct === productId) {
            return;
        }

        updateState({ currentProduct: productId });
        const message = JSON.stringify({
            productId,
            button,
            embed,
        })

        const gumroadIframe = document
            .getElementsByClassName('gumroad-iframe')[0];

        gumroadIframe
            .contentWindow
            .postMessage(message, state.iframeUrl);

        console.log('message sent!');
    }

    /**
     * Unhides the iframe
     */
    const showIframe = () => {
        document
            .getElementsByClassName('gumroad-iframe')[0]
            .style.display = 'flex';
    }

    // Logic
    // http://jsben.ch/mW36e
    for (let i = gumroadButtons.length - 1; i >= 0; --i) {
        const gumroadButton = gumroadButtons[i];
        gumroadButton.addEventListener('mouseenter', updateIframe);
        gumroadButton.addEventListener('click', showIframe);
    }

    embedGumroadStyle();
    embedIframe();
})();