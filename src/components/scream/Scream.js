import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Card} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from "../../util/MyButton";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";

const styles = {
    card: {
        display: 'flex',
        marginBottom: 10,
        position: 'relative'
    },
    image: {
        minWidth: 180,
        minHeight: 150
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Scream extends Component {

    render() {
        dayjs.extend(relativeTime);
        const {
            classes, scream: {body, createdAt, userImage, handle, screamId, likeCount, commentCount},
            user: {authenticated, credentials}
        } = this.props;

        const deleteButton = authenticated && handle === credentials.handle ? (
            <DeleteScream screamId={screamId}/>
        ): null;
        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title='Profile image' className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant='h5' component={Link} to={`/users/${handle}`}
                                color='primary'>{handle}</Typography>
                    {deleteButton}
                    <Typography variant='body2' color='textSecondary'>{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant='body1'>{body}</Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} likes</span>
                    <MyButton tip='comments'>
                        <ChatIcon color='primary'/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <ScreamDialog screamId={screamId} handle={handle} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        );
    }
}

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
