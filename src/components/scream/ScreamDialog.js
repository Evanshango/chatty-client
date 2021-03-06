import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import {getScream, clearErrors} from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import LikeButton from "./LikeButton";
import ChatIcon from "@material-ui/icons/Chat";
import Comments from "../comments/Comments";
import CommentForm from "../comments/CommentForm";

const styles = theme => ({
    ...theme.styling,
    closeButton: {
        position: 'absolute',
        left: '91%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    dialogContent: {
        padding: 20
    },
    profileImage: {
        maxWidth: 150,
        height: 150,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    spinnerDiv: {
        textAlign: 'center',
        margin: 50
    }
});

class ScreamDialog extends Component {

    state = {open: false, oldPath: '', newPath: ''};

    componentDidMount() {
        if (this.props.openDialog){
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;
        const {handle, screamId} = this.props;
        const newPath = `/users/${handle}/scream/${screamId}`;

        if (oldPath === newPath) oldPath = `/users/${handle}`;

        window.history.pushState(null, null, newPath);

        this.setState({open: true, oldPath, newPath});
        this.props.getScream(this.props.screamId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({open: false});
        this.props.clearErrors();
    };


    render() {
        const {
            classes, scream: {screamId, body, createdAt, likeCount, commentCount, userImage, handle, comments},
            UI: {loading}
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}/>
            </div>
        ) : (
            <Grid container>
                <Grid item sm={4}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} color='primary' variant='h5' to={`/users/${handle}`}>
                        @{handle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant='body2' color='textSecondary'>
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant='body1'>
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} likes</span>
                    <MyButton tip='comments'>
                        <ChatIcon color='primary'/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <CommentForm screamId={screamId}/>
                <Comments comments={comments}/>
            </Grid>
        );

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip='Expand scream' tipClassName={classes.expandButton}>
                    <UnfoldMore color='primary'/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
                    <MyButton tip='Close' onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

ScreamDialog.propType = {
    clearErrors: PropTypes.func.isRequired,
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    scream: state.data.scream,
    UI: state.UI
});

const mapActionsToProps = {
    getScream,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
