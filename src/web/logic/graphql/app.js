import {gql, graphql} from "react-apollo";


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
  props: ({ownProps, data}) => {
    const {loading} = data;
    if (loading) {
      return Object.assign({}, ownProps, {loading});
    }
    return Object.assign({}, ownProps, {loading, tasks: data.models.Task});
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
  options: {
    update: (proxy, {data: {models: {Task: {create}}}}) => {
      const data = proxy.readQuery({query: getTasksQuery});
      data.models.Task.push(create);
      proxy.writeQuery({query: getTasksQuery, data});
    },
  },
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
      delete(id: $id)
    }
  }
}`;

export const deleteTask = graphql(deleteTaskMutation, {
  name: "deleteTask",
  options: {
    refetchQueries: [ //TODO: fix this to use update instead. waiting on https://github.com/VostroNet/sql2gql/issues/8
      "getTasks",
    ],
  },
});
