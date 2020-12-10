import React from "react";
import { connect } from "react-redux";
import "./Creatures.css";
import SearchCreatures from "../../components/SearchCreatures/SearchResult/SearchResult";
import Aux from "../../hoc/Auxiliary";
import * as actions from "../../store/actions/index";
import Loading from "../../components/UI/Loader/Loader";
import Modal from "../../components/UI/Modal/Modal";
import Identification from "../../components/Identification/Identification";
import RedBook from "./RedBook/RedBook";
import HeadingTitle from "../../components/UI/HeadingTitle/HeadingTitle";

const Creatures = (props) => {
  const confirmError = () => {
    props.onDeleteError();
  };

  return (
    <div style={{ margin: "100px" }}>
      <div>
        <HeadingTitle mode="heading" title="Sinh vật rừng Việt Nam" filter />
        <div>
          {props.creaturesError && props.speciesError ? (
            <Modal show BackdropClicked={confirmError}>
              {props.creaturesError}
              {props.speciesError}
            </Modal>
          ) : null}
          {props.filterDataLoading ? (
            <Loading />
          ) : (
            <Aux>
              <main className="cd-main-content">
                <SearchCreatures />
              </main>
            </Aux>
          )}
        </div>
      </div>
      <div>
        <RedBook />
        <Identification />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    speciesLoading: state.species.loading,
    speciesError: state.species.error,
    creaturesError: state.creatures.error,
    species: state.species.species,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteError: () => {
      dispatch(actions.deleteError());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Creatures);
