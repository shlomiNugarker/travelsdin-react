import { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoogleMapReact from 'google-map-react'
import { useDispatch, useSelector } from 'react-redux'
import { UserIconPos } from '../cmps/map/UserIconPos'
import { MapMenu } from '../cmps/map/MapMenu'
import { PostIconMap } from '../cmps/map/PostIconMap'
import { ImgPreview } from '../cmps/profile/ImgPreview'
import { CreatePostModal } from '../cmps/posts/CreatePostModal'
import {
  loadPosts,
  savePost,
  setCurrPage,
  setFilterByPosts,
} from '../store/actions/postActions'
import {
  getUsers,
  setFilterByUsers,
  updateUser,
} from '../store/actions/userActions'

export function Map() {
  const dispatch = useDispatch()

  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: 32.05591645013164,
      lng: 34.7549857056555,
    },
    zoom: 2,
    yesIWantToUseGoogleMapApiInternals: true,
  })
  const [isCloseUserIcon, setIsCloseUserIcon] = useState(false)
  const [isMapClicked, setIsMapClicked] = useState(false)
  const [menuPosition, setMenuPosition] = useState(null)
  const [postToPreview, setPostToPreview] = useState(false)
  const [isShowCreatePost, setIsCreateShowPost] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)
  const { users } = useSelector((state) => state.userModule)
  const { posts } = useSelector((state) => state.postModule)

  useEffect(() => {
    dispatch(setCurrPage('map'))
    const filterBy = {
      position: 'position',
    }
    dispatch(setFilterByUsers(filterBy))
    dispatch(getUsers())
    dispatch(setFilterByPosts(filterBy))
    dispatch(loadPosts())
    getLocation()

    return () => {
      dispatch(setFilterByPosts(null))
      dispatch(setFilterByUsers(null))
    }
  }, [])

  // // Return map bounds based on list of places
  // const getMapBounds = (map, maps, places) => {
  //   const bounds = new maps.LatLngBounds()

  //   places.forEach((place) => {
  //     bounds.extend(new maps.LatLng(place.lat, place.lng))
  //   })
  //   return bounds
  // }
  // // Re-center map when resizing the window
  // const bindResizeListener = (map, maps, bounds) => {
  //   maps.event.addDomListenerOnce(map, 'idle', () => {
  //     maps.event.addDomListener(window, 'resize', () => {
  //       map.fitBounds(bounds)
  //     })
  //   })
  // }

  const saveUser = (position) => {
    if (!loggedInUser) return
    dispatch(updateUser({ ...loggedInUser, position }))
  }

  const togglePostToPreview = (post) => {
    if (postToPreview) setPostToPreview(null)
    else {
      setPostToPreview(post)
    }
  }

  const toggleShowCreatePost = () => {
    setIsCreateShowPost((prev) => !prev)
  }

  const onAddPost = (post) => {
    const postToAdd = {
      ...post,
      userId: loggedInUser._id,
      position: menuPosition,
    }
    dispatch(savePost(postToAdd)).then(() => toggleShowCreatePost())
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }
  function showPosition(position) {
    const positionToSave = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
    if (position) saveUser(positionToSave)
  }

  const closeUserIcon = () => {
    setIsCloseUserIcon((prev) => !prev)
  }

  const onClickMap = (ev) => {
    const positionOfMenu = {
      lat: ev.lat,
      lng: ev.lng,
    }
    closeUserIcon()
    setMenuPosition(positionOfMenu)
    setIsMapClicked((prev) => !prev)
  }

  const places = [{ lat: 30.911220168353783, lng: 58.405513914562775 }]

  console.log('render Map')
  return (
    // Important! Always set the container height explicitly
    <section className="map-page ">
      <div className="map" style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals
          // onGoogleApiLoaded={({ map, maps }) =>
          //   handleApiLoaded(map, maps, places)
          // }
          onChange={() => console.log('onBoundsChange')}
          onClick={(ev) => onClickMap(ev)}
          onDrag={(map) => console.log('onDrag')}
          onDragEnd={(map) => console.log('onDragEnd')}
          onRightClick={() => console.log('onRightClick')}
        >
          {users &&
            users.map((user) => (
              <UserIconPos
                key={user._id}
                lat={user?.position?.lat || 32.05591645013164}
                lng={user?.position?.lng || 34.7549857056555}
                url={user.imgUrl}
                userId={user._id}
                fullname={user.fullname}
                isCloseUserIcon={isCloseUserIcon}
              />
            ))}

          {posts &&
            posts.map((post) => (
              <PostIconMap
                key={post?._id}
                lat={post?.position?.lat}
                lng={post?.position?.lng}
                post={post}
                setPostToPreview={setPostToPreview}
              />
            ))}

          {isMapClicked && menuPosition && (
            <MapMenu
              menuPosition={menuPosition}
              lat={menuPosition.lat}
              lng={menuPosition.lng}
              setIsCreateShowPost={setIsCreateShowPost}
            />
          )}
        </GoogleMapReact>
      </div>

      {postToPreview && (
        <ImgPreview
          toggleShowImg={togglePostToPreview}
          title={postToPreview.title}
          body={postToPreview.body}
          imgUrl={postToPreview.imgBodyUrl}
          post={postToPreview}
          videoUrl={postToPreview?.videoBodyUrl}
        />
      )}

      {isShowCreatePost && (
        <CreatePostModal
          isShowCreatePost={isShowCreatePost}
          onAddPost={onAddPost}
          toggleShowCreatePost={toggleShowCreatePost}
          loggedInUser={loggedInUser}
        />
      )}
      <button
        onClick={() =>
          setDefaultProps({
            center: {
              lat: 32.29430021651131,
              lng: 58.140507578610226,
            },
            zoom: 6,
            yesIWantToUseGoogleMapApiInternals: true,
          })
        }
      >
        btn
      </button>
    </section>
  )
}
