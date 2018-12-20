import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import SMSButton from './SMSButton';
import SMS from './SMS';
import './CustomActions';

export default class SmsPlugin extends FlexPlugin {
  name = 'SmsPlugin';

  init(flex, manager) {
    //adds the sms button to the navbar
    flex.SideNav.Content.add(<SMSButton key="sidebarsmsbutton"/>);

    //adds the sms view
    flex.ViewCollection.Content.add(<flex.View name="sms" key="sms"><SMS key="sms2"/></flex.View>);
  }
}
