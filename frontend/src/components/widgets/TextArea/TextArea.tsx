/**
 * @license
 * Copyright 2018-2019 Streamlit Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"
import { Textarea as UITextArea } from "baseui/textarea"
import { Map as ImmutableMap } from "immutable"
import { WidgetStateManager, Source } from "lib/WidgetStateManager"

interface Props {
  disabled: boolean
  element: ImmutableMap<string, any>
  widgetMgr: WidgetStateManager
  width: number
}

interface State {
  /**
   * True if the user-specified state.value has not yet been synced to the WidgetStateManager.
   */
  dirty: boolean

  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: string
}

class TextArea extends React.PureComponent<Props, State> {
  public state: State = {
    dirty: false,
    value: this.props.element.get("default"),
  }

  public componentDidMount(): void {
    this.setWidgetValue({ fromUi: false })
  }

  private setWidgetValue = (source: Source): void => {
    const widgetId: string = this.props.element.get("id")
    this.props.widgetMgr.setStringValue(widgetId, this.state.value, source)
    this.setState({ dirty: false })
  }

  private onBlur = (): void => {
    if (this.state.dirty) {
      this.setWidgetValue({ fromUi: true })
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({
      dirty: true,
      value: e.target.value,
    })
  }

  private onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && e.ctrlKey && this.state.dirty) {
      this.setWidgetValue({ fromUi: true })
    }
  }

  public render = (): React.ReactNode => {
    const style = { width: this.props.width }
    const label = this.props.element.get("label")

    return (
      <div className="Widget stTextArea" style={style}>
        <label>{label}</label>
        <UITextArea
          value={this.state.value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          disabled={this.props.disabled}
        />
        {this.state.dirty ? (
          <div className="instructions">Press Ctrl+Enter to apply</div>
        ) : null}
      </div>
    )
  }
}

export default TextArea
