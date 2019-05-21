import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@twilio/flex-ui';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const smsCanvas = css`
  width: 300px;
  margin-left: 50px;
`

const input = css`
  width: 100%;
  textarea {
    padding: 6px 12px 7px 12px !important;
  }
`

export class OutboundSmsView extends React.Component {

  state = {
    To: '',
    From: '',
    Message: ''
  }

  startSMS() {
    const to = encodeURIComponent(this.state.To);
    const from = encodeURIComponent(this.state.From);
    const message = encodeURIComponent(this.state.Message);
    const url = this.props.url;

    if (to.length > 0 && from.length > 0) {
      fetch(`${url}/create-new-sms`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `From=${from}&To=${to}&Message=${message}&Token=${this.props.jweToken}`
      })
      .then(Actions.invokeAction('NavigateToView', {viewName: 'agent-desktop'}));
    } else {
      console.log('Invalid number entered');
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div css={smsCanvas}>
        <div>
          <TextField
            id='To'
            label='To'
            css={input}
            value={this.state.To}
            onChange={this.handleChange('To')}
            margin='normal'
            variant='outlined'
          />
          <TextField
            id='From'
            label='From'
            css={input}
            value={this.state.From}
            onChange={this.handleChange('From')}
            margin='normal'
            variant='outlined'
          />
          <TextField
            id='Message'
            label='Message'
            multiline
            rows='4'
            css={input}
            value={this.state.Message}
            onChange={this.handleChange('Message')}
            margin='normal'
            variant='outlined'
          />
        </div>
        <Button variant='contained' color='primary' onClick={e => this.startSMS()}>Submit</Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    url: state.flex.config.serviceBaseUrl.slice(0,5) === 'https'
      ? (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)
      : ('https://' + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl))
  }
}

export default connect(mapStateToProps)(OutboundSmsView);
