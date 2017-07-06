import {gql, graphql} from "react-apollo";

export const afterUpdateTaskQuery = gql`
  subscription onAfterUpdateTask {
    afterUpdateTask {
      id
      name
      options {
        completed
      }
    }
  }
`;

export const afterCreateTaskQuery = gql`
  subscription onAfterCreateTask {
    afterCreateTask {
      id
      name
      options {
        completed
      }
    }
  }
`;

export const afterDestroyTaskQuery = gql`
  subscription onAfterDestroyTask {
    afterDestroyTask {
      id
    }
  }
`;

export const getTasksQuery = gql`
query getTasks {
  models {
    Task {
      id,
      name,
      options{
        completed
      }
    }
  }
}`;
const getTasksQueryOptions = {
  props: (props) => {
    const {ownProps, data} = props;
    const {loading} =  data || {};
    function subscribeTaskEvents() {
      props.data.subscribeToMore({
        document: afterCreateTaskQuery,
        updateQuery(prev, result) {
          const newTask = result.subscriptionData.data.afterCreateTask;
          const taskExist = prev.models.Task.filter((task) => newTask.id === task.id).length === 0;
          if (taskExist) {
            return Object.assign({}, prev, {
              models: Object.assign({}, prev.models, {
                Task: [...prev.models.Task, newTask],
              }),
            });
          }
          return prev;
        },
      });
      props.data.subscribeToMore({
        document: afterUpdateTaskQuery,
      });
      props.data.subscribeToMore({
        document: afterDestroyTaskQuery,
        updateQuery(prev, result) {
          const id = result.subscriptionData.data.afterDestroyTask.id;
          return Object.assign({}, prev, {
            models: Object.assign({}, prev.models, {
              Task: prev.models.Task.filter((task) => {
                return task.id !== id;
              }),
            }),
          });
        },
      });
    }
    if (loading) {
      return Object.assign({}, ownProps, {loading, subscribeTaskEvents});
    }
    return Object.assign({}, ownProps, {
      loading,
      tasks: data.models.Task,
      subscribeTaskEvents,
    });
  },
};
export const getTasks = graphql(getTasksQuery, getTasksQueryOptions);


export const createTaskMutation = gql`
mutation createTask($input: TaskRequiredInput!) {
  models {
    Task {
      create(input: $input) {
        id,
        name,
        options {
          completed
        }
      }
    }
  }
}`;

export const createTask = graphql(createTaskMutation, {
  name: "createTask",
  // options: {
  //   update: (proxy, {data: {models: {Task: {create}}}}) => {
  //     const data = proxy.readQuery({query: getTasksQuery});
  //     data.models.Task.push(create);
  //     proxy.writeQuery({query: getTasksQuery, data});
  //   },
  // },
});


export const completeTaskMutation = gql`
mutation completeTask($input: TaskCompleteInput!) {
  models {
    Task {
      complete(input: $input) {
        id,
        name,
        options {
          completed
        }
      }
    }
  }
}`;

export const completeTask = graphql(completeTaskMutation, {
  name: "completeTask",
});

export const deleteTaskMutation = gql`
mutation deleteTask($id: Int) {
  models {
    Task {
      delete(id: $id) {
        id
      }
    }
  }
}`;

export const deleteTask = graphql(deleteTaskMutation, {
  name: "deleteTask",
  // options: {
  //   update: (proxy, result) => {
  //     const id = result.data.models.Task.delete.id;
  //     const data = proxy.readQuery({query: getTasksQuery});
  //     data.models.Task = data.models.Task.filter((task) => {
  //       return task.id !== id;
  //     });
  //     proxy.writeQuery({query: getTasksQuery, data: data});
  //   },
  // },
});
