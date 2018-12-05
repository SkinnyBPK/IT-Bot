    import React, { Component } from 'react';
    import Pusher from 'pusher-js';
    import './App.css';
    import 'materialize-css/dist/css/materialize.min.css';
    import Popup from 'react-popup';
    

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          userMessage: '',
          conversation: [],
        };
      }

      componentDidMount() {
        const pusher = new Pusher('26b32dcde869d5c661b0', {
          cluster: 'us2',
          encrypted: true,
        });

        const channel = pusher.subscribe('bot');
        channel.bind('bot-response', data => {
          const msg = {
            text: data.message,
            user: 'ai',
          };
          this.setState({
            conversation: [...this.state.conversation, msg],
          });
        });
      }

      handleChange = event => {
        this.setState({ userMessage: event.target.value });
      };

      handleSubmit = event => {
        event.preventDefault();
        if (!this.state.userMessage.trim()) return;

        const msg = {
          text: this.state.userMessage,
          user: 'human',
        };

        this.setState({
          conversation: [...this.state.conversation, msg],
        });

        fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: this.state.userMessage,
          }),
        });

        this.setState({ userMessage: '' });
      };

      render() {
        const ChatBubble = (text, i, className) => {
          return (
            <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
              <span className="chat-content">{text}</span>
            </div>
          );
        };

        const chat = this.state.conversation.map((e, index) =>
          ChatBubble(e.text, index, e.user)
        );

        return (
          <div className="App">
            <nav>
              <div className="nav-wrapper">
                <a href="#!" className="center brand-logo">React Chatbot</a>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">dehaze</i></a>
                <ul className="left hide-on-med-and-down">
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Servicios</a></li>
                  <li><a href="#">Infraestructura</a></li>
                  <li><a href="#">Contacto</a></li>
                </ul>
              </div>
            </nav>

              <ul className="sidenav" id="mobile-demo">
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Servicios</a></li>
                  <li><a href="#">Infraestructura</a></li>
                  <li><a href="#">Contacto</a></li>
              </ul>
            
            <div>
              <div className="chat-window col s6 ">
                <div className="conversation-view">{chat}</div>
                <div className="message-box">
                  <form onSubmit={this.handleSubmit}>
                    <input
                      value={this.state.userMessage}
                      onInput={this.handleChange}
                      className="text-input"
                      type="text"
                      autoFocus
                      placeholder="Type your message and hit Enter to send"
                    />
                  </form>
                </div>
              </div>
            </div>
              
            <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
            <script type="text/javascript" src="js/materialize.js"></script>
          </div>
        );
      }
    }

    export default App;
