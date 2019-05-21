import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import OutboundSmsButton from './OutboundSmsButton';
import OutboundSmsView from './OutboundSmsView';

export default class OutboundSmsPlugin extends FlexPlugin {
  name = 'OutboundSmsPlugin';

  init(flex, manager) {
    // adds the sms button to the navbar
    flex.SideNav.Content.add(<OutboundSmsButton key="nav-outbound-sms-button"/>);
    
    // get the JWE for authenticating the worker in our Function
    const jweToken = manager.store.getState().flex.session.ssoTokenPayload.token

    // adds the sms view
    flex.ViewCollection.Content.add(
      <flex.View name="sms" key="outbound-sms-view-parent">
        <OutboundSmsView key="outbound-sms-view" jweToken={jweToken} />
      </flex.View>
    );
  }
}
