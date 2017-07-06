import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import {compose} from "react-apollo";
import {List, ListItem} from "material-ui/List";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import DoneIcon from "material-ui/svg-icons/action/done";
import ClearIcon from "material-ui/svg-icons/content/clear";
import {Form} from "formsy";
import FormsyText from "formsy-material-ui/lib/FormsyText";

import Component from "web/components/promise";
import {
  getTasks,
  completeTask,
  createTask,
  deleteTask,
} from "web/logic/graphql/app";

class TaskList extends Component {
  constructor() {
    super();
    this.state = {
      submitting: false,
    };
  }
  componentWillMount() {
    this.props.subscribeTaskEvents();
  }
  handleDeleteTouchTap(taskId) {
    return (e) => {
      return this.props.deleteTask({
        variables: {
          id: taskId,
        },
      });
    };
  }
  async handleFormSubmit(model) {
    await this.setStateAsync({
      submitting: true,
    });
    try {
      await this.props.createTask({
        variables: {
          input: model,
        },
      });
      await this.setStateAsync({
        submitting: false,
      });
      this.form.reset();
    } catch (err) {
      await this.setStateAsync({
        submitting: false,
      });
      this.form.updateInputsWithError(err.graphQLErrors[0].message);
    }
  }
  handleToggleComplete(taskId) {
    return (e) => {
      return this.props.completeTask({
        variables: {
          input: {id: taskId},
        },
      });
    };
  }
  render() {
    const {loading, tasks} = this.props;
    if (loading) {
      return (<div />);
    }
    return (<div>
      <Form ref={(form) => (this.form = form)} onValidSubmit={this.handleFormSubmit} disabled={this.state.submitting}>
        <FormsyText
          floatingLabelText="Task Name"
          fullWidth
          required
          disabled={this.state.submitting}
          name="name" />
        <RaisedButton
          label="Create"
          primary
          fullWidth
          type="submit"
          disabled={this.state.submitting} />
      </Form>
      <List>
        {tasks.map((task) => {
          return (<ListItem key={`listItem-${task.id}`} primaryText={task.name}
            leftIcon={(task.options || {}).completed ? (<DoneIcon />) : (<ClearIcon onTouchTap={this.handleToggleComplete(task.id)} />) }
            rightIcon={<DeleteIcon onTouchTap={this.handleDeleteTouchTap(task.id)} />} />);
        })}
      </List>
    </div>);
  }
}

export default compose(
  getTasks,
  completeTask,
  createTask,
  deleteTask,
)(TaskList);
