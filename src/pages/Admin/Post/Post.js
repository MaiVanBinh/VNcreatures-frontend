import React, { useEffect, useState } from "react";
import "./Post.css";
import TableAdminvV1 from "../../../components/UI/TableAdminvV1/TableAdminvV1";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import Modal from "../../../components/UI/Modal/Modal";
import PostUpdate from "./PostDetail/PostDetail";
import DeleteForm from "../../../components/DeleteForm/DeleteForm";

const TABLE_CONFIG = {
  id: "id",
  title: "Title",
  author: "Author",
  category: "CategoryId",
  created_by: "OwnerId",
  created_at: "Created Day",
  updated_at: "Last Update",
};

const Post = (props) => {
  const [entries, setEntries] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [postDelete, setPostDelete] = useState(null);
  const [numberPage, setNumberPage] = useState(0);
  useEffect(() => {
    if (props.totalPost > 0) {
      setNumberPage(Math.floor(props.totalPost / entries) + 2);
    }
  }, [props.totalPost]);

  useEffect(() => {
    props.onFetchPost({ categories: "", limit: 15, page: 1 });
  }, []);
  const onFetchDataByPage = (page) => {
    props.onFetchPost({ categories: "", limit: 15, page: page })
  }
  const onViewDetailHandler = (item) => {
    const link = window.location.origin + "/bai-viet/" + item.id;
    window.open(link, "_blank");
  };

  const editHandler = (item) => {
    setShowModal(true);
    setEditPost(item);
  };

  const onCloseModal = () => {
    setEditPost(null);
    setShowModal(false);
    props.onPostEndForm();
    setIsDelete(false);
    setPostDelete(null);
  };

  const createNewPost = () => {
    setShowModal(true);
  };

  const deletePost = (item) => {
    setIsDelete(true);
    setPostDelete(item);
  };

  const cancleDelete = () => {
    setIsDelete(false);
    setPostDelete(null);
  };

  const confimDeletePost = () => {
    if (postDelete) {
      props.onDeletePost(postDelete.id, props.token);
    }
  };

  return (
    <div>
      <Modal show={showModal} modalClosed={onCloseModal}>
        <PostUpdate editPost={editPost} formClosed={onCloseModal} />
      </Modal>
      <Modal show={isDelete} modalClosed={onCloseModal}>
        <DeleteForm
          title={postDelete ? postDelete.title : ""}
          cancleDelete={cancleDelete}
          confimDelete={confimDeletePost}
          deleteSuccess={props.formSubmit}
        />
      </Modal>
      <TableAdminvV1
        tableConfig={TABLE_CONFIG}
        data={props.posts}
        onViewDetail={onViewDetailHandler}
        onEdit={editHandler}
        createClick={createNewPost}
        deleteClick={deletePost}
        fetchData={onFetchDataByPage}
        numberPage={numberPage}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
    token: state.auth.token,
    formSubmit: state.posts.formSubmit,
    totalPost: state.posts.total
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPost: (payload) => dispatch(actions.fetchPost(payload)),
    onPostEndForm: () => dispatch(actions.postEndForm()),
    onDeletePost: (id, token) => dispatch(actions.deletePost(id, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
