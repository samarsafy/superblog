import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      posts: [],
      form: {},
      editing: null,
      order: 0,
      editing: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount(){
    fetch(`http://localhost:5000/api/posts`).then(resp => resp.json()).then(posts => {
      this.setState({ posts });
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    let form = this.state.form
    fetch("http://localhost:5000/api/posts", {
      method:"post",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json"
      }
    }).then(response => response.json())
    .then(response => {
      console.log(response)
      let posts = {...this.state.posts}
      var posts_array = []
      for (var key in posts) {
        if (posts.hasOwnProperty(key)) {
          posts_array.push(posts[key])
        }
      }
      posts_array.push(response.post)
      this.setState({posts: posts_array});
    });
  }

  handleChange(e) {
    let form = {...this.state.form};
    console.log(form)
    console.log(e.target.value)
    if(e.target.value !== ""){
      form[e.target.id] = e.target.value
      console.log(form[e.target.id])
    }
    console.log(form)
    this.setState({form})
  }

  handleDelete(id) {
    console.log(id);
    axios.delete(`http://localhost:5000/api/posts/${id}`).then(response => {
      console.log("Slide deleted successful: ", response);
      fetch(`http://localhost:5000/api/posts`).then(resp => resp.json()).then(posts => {
        this.setState({ posts });
      });
    }).catch(function (error) {
      console.log("Error: ", error);
    })
  }

  handleUpdate(event, post) {
    event.preventDefault()
    axios.put(`http://localhost:5000/api/posts/${post._id}`, this.state.form).then(response => {
      console.log("Slide edited successful: ", response);
      fetch(`http://localhost:5000/api/posts`).then(resp => resp.json()).then(posts => {
        this.setState({ posts: posts, editing: null });
        M.toast({html:'post updated successfully!'})
      });
    }).catch(function (error) {
      console.log("Error: ", error);
    })
  }
  handelEdit(post) {
    this.setstate ({
      form: post,
      editing: post
    })
  }
  render() {
   const posttemplate = this.state.posts.map(post => (
    this.state.editing && this.state.editing._id === post._id ? (
      <form onSubmit={(event) => this.handleUpdate(event, post)}>
      <div className="form-group">
      <label className="w-100">
      Name:
      <input className="form-control" defaultValue={this.state.editing.name} id="name" onChange={this.handleChange}/>
      </label>
      </div>
      <div className="form-group">
      <label className="w-100">
      content:
      <textarea id="content" className"form-control" defaultValue={this.state.editing.content} id="name" onChange={this.handleChange}/>
      </label>
      </div>
      <div className="form-group">
      <input className="btn btn-primary" type="submit" value"Submit"/>
      </div>
      </form>
      ) : (
          <li className="list-group-item">
           <h2>{ post.name}</h2>
           <p>{post.content}</p>
           <button className="btn btn-info" onClick={() => this.handleEdit(post)}>Edit</button>
           <button className="btn btn-danger" onClick={() => this.handleDelete(post._id)}>Remove</button>
        </li>
      )
    ))

    return (
      <div className="container">
        <div className="my-3">
          <h2>Create a post:</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>
                Name:
                <input className="form-control" id="name" onChange={this.handleChange} />
              </label>
            </div>
            <div className="form-group">
              <label>
                Content:
                <textarea id="content" className="materialize-textarea" defaultValue = {this.state.editing.content} onChange={this.handleChange} />
              </label>
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Submit" />
            </div>
          </form>
        </div>
        <div className="my-3">
          <h2>List of all posts:</h2>
          <ul className="list-group">
            {posttemplate }
            
          </ul>
        </div>
      </div>
    );
  }
}
export default App;
