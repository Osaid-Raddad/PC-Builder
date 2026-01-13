import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";
import { apiClient } from "../../config/api";
import EditProfileModal from "./EditProfileModal";

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    name: 'Loading...',
    email: 'Loading...',
    phone: '-',
    city: '-',
    street: '-',
    location: '-',
    bio: 'Loading profile...',
    role: 'Member',
    joinDate: '-',
    avatar: 'https://ui-avatars.com/api/?name=User&background=F9B233&color=fff&size=200',
    stats: {
      builds: 0,
      favorites: 0,
      posts: 0
    }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [ratingAppointment, setRatingAppointment] = useState(null);

  useEffect(() => {
    checkAuthenticationAndFetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'posts' && myPosts.length === 0) {
      fetchMyPosts();
    }
    if (activeTab === 'appointments' && appointments.length === 0 && (userData?.role === 'Admin' || userData?.role === 'SuperAdmin')) {
      fetchAppointments();
    }
  }, [activeTab, userData]);

  const checkAuthenticationAndFetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      
      await fetchProfileData();
    } catch (error) {
      console.error('Error:', error);
      navigation.replace('Login');
    }
  };

  const fetchProfileData = async () => {
    try {
      
      const profileResponse = await apiClient.get('/Profile/UserProfile/profile');
      const profileData = profileResponse.data;
      
      // Check if user is TechSupport and redirect to TechSupportProfileScreen
      if (profileData.role === 'TechSupport') {
        navigation.replace('TechSupportProfile');
        return;
      }
      
      let postsCount = 0;
      try {
        const postsResponse = await apiClient.get('/User/Posts/myPost/count');
        postsCount = postsResponse.data || 0;
      } catch (error) {
        console.error('Error fetching posts count:', error);
      }
      
      const transformedData = {
        id: profileData.id,
        name: profileData.fullName || 'User',
        email: profileData.email || '-',
        phone: profileData.phone || '-',
        city: profileData.city || '-',
        street: profileData.street || '-',
        location: profileData.city && profileData.street 
          ? `${profileData.street}, ${profileData.city}` 
          : profileData.city || profileData.street || '-',
        bio: profileData.bio || 'No bio yet',
        role: profileData.role || 'Member',
        joinDate: profileData.createdAt 
          ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })
          : '-',
        avatar: profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || 'User')}&background=F9B233&color=fff&size=200`,
        stats: {
          builds: 0,
          favorites: 0,
          posts: postsCount
        }
      };
      
      setUserData(transformedData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const fetchMyPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await apiClient.get('/User/Posts/myPosts');
      setMyPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await apiClient.get('/TechSupport/Appointment/myAppointment');
      
      const statusMap = {
        0: 'pending',
        1: 'accepted',
        2: 'rejected',
        3: 'completed'
      };
      
      const transformedData = response.data.map(apt => {
        const startDate = new Date(apt.startDateTime);
        const endDate = new Date(apt.endDateTime);
        const date = startDate.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const startTime = startDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const endTime = endDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return {
          id: apt.id,
          techSupportName: apt.techSupportName,
          date,
          time: `${startTime} - ${endTime}`,
          status: statusMap[apt.status] || 'pending',
          rating: apt.rating
        };
      });
      
      setAppointments(transformedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleRateAppointment = async (appointmentId, rating) => {
    try {
      await apiClient.post(`/TechSupport/Appointment/rate/${appointmentId}`, { rating });
      
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, rating } : apt
        )
      );
      
      setRatingAppointment(null);
      Alert.alert('Success', 'Rating submitted!');
    } catch (error) {
      console.error('Error rating appointment:', error);
      Alert.alert('Error', 'Failed to submit rating');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return colors.platinum;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post?',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/User/Posts/${postId}`);
              fetchMyPosts();
              fetchProfileData();
            } catch (error) {
              console.error('Error deleting post:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { label: 'Published', color: '#10b981', bgColor: '#d1fae5' },
      2: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7' },
      0: { label: 'Draft', color: '#6b7280', bgColor: '#f3f4f6' }
    };
    return statusConfig[status] || statusConfig[0];
  };

  const handleEditProfile = async (updatedData, avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('FullName', updatedData.name || '');
      formData.append('Email', updatedData.email || '');
      formData.append('Phone', updatedData.phone || '');
      formData.append('City', updatedData.city || '');
      formData.append('Street', updatedData.street || '');
      formData.append('Bio', updatedData.bio || '');
      
      if (avatarFile) {
        const fileType = avatarFile.uri.split('.').pop();
        formData.append('ProfileImage', {
          uri: avatarFile.uri,
          type: `image/${fileType}`,
          name: `profile.${fileType}`,
        });
      }
      
      await apiClient.put('/Profile/UserProfile/update', formData);
      await fetchProfileData();
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.multiRemove(['authToken', 'fullName', 'userRole']);
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
      }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This cannot be undone!', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete('/Profile/Profile/delete');
            await AsyncStorage.multiRemove(['authToken', 'fullName', 'userRole']);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          } catch (error) {
            Alert.alert('Error', 'Failed to delete account');
          }
        }
      }
    ]);
  };

  if (isLoading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.mainYellow} />
      </View>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'user' },
    { id: 'builds', label: 'Builds', icon: 'box' },
    { id: 'posts', label: 'Posts', icon: 'message-square' },
    ...(userData?.role === 'Admin' || userData?.role === 'SuperAdmin' 
      ? [{ id: 'appointments', label: 'Appointments', icon: 'calendar' }] 
      : []),
    { id: 'favorites', label: 'Favorites', icon: 'heart' },
  ];

  const menuItems = [
    { icon: "settings", label: "Settings", screen: "Settings" },
    { icon: "help-circle", label: "Support", screen: "TechSupport" },
    { icon: "file-text", label: "Terms", screen: "TermsOfService" },
  ];

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <ScrollView style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userData?.avatar }} style={styles.avatar} />
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={12} color="white" />
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
                <Feather name="edit-2" size={16} color="white" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Feather name="trash-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.userName}>{userData?.name}</Text>
          <Text style={styles.userBio}>{userData?.bio}</Text>

          <View style={styles.contactInfo}>
            <View style={styles.infoItem}>
              <Feather name="mail" size={14} color={colors.mainYellow} />
              <Text style={styles.infoText}>{userData?.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="phone" size={14} color={colors.mainYellow} />
              <Text style={styles.infoText}>{userData?.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={14} color={colors.mainYellow} />
              <Text style={styles.infoText}>{userData?.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={14} color={colors.mainYellow} />
              <Text style={styles.infoText}>Joined {userData?.joinDate}</Text>
            </View>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{userData?.role}</Text>
          </View>

          {/* Dashboard Button for Admins */}
          {(userData?.role === 'Admin' || userData?.role === 'SuperAdmin') && (
            <TouchableOpacity 
              style={styles.dashboardButton} 
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Feather name="bar-chart-2" size={18} color="white" />
              <Text style={styles.dashboardButtonText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}

          <View style={styles.statsContainer}>
            {['builds', 'favorites', 'posts'].map(key => (
              <View key={key} style={styles.stat}>
                <Text style={styles.statValue}>{userData?.stats[key]}</Text>
                <Text style={styles.statLabel}>{key}</Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Feather name={tab.icon} size={18} color={activeTab === tab.id ? 'white' : colors.text} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <View style={styles.overviewContainer}>
              <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Quick Stats</Text>
                {[
                  { label: 'Build Value', value: '$6,500' },
                  { label: 'Avg Price', value: '$1,300' },
                  { label: 'Views', value: '234' }
                ].map((stat, i) => (
                  <View key={i} style={styles.statRow}>
                    <Text style={styles.statRowLabel}>{stat.label}</Text>
                    <Text style={styles.statRowValue}>{stat.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'builds' && (
            <View style={styles.emptyState}>
              <Feather name="box" size={40} color={colors.mainYellow} />
              <Text style={styles.emptyTitle}>No Builds Yet</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Builder')}>
                <Text style={styles.emptyButtonText}>Start Building</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'posts' && (
            <>
              {postsLoading ? (
                <ActivityIndicator size="large" color={colors.mainYellow} />
              ) : myPosts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="message-square" size={40} color={colors.mainYellow} />
                  <Text style={styles.emptyTitle}>No Posts</Text>
                </View>
              ) : (
                <View style={styles.postsContainer}>
                  {myPosts.map(post => {
                    const status = getStatusBadge(post.status);
                    return (
                      <View key={post.id} style={styles.postCard}>
                        <View style={styles.postHeader}>
                          <Image
                            source={{ uri: `https://ui-avatars.com/api/?name=${post.userFullName}&background=F9B233&color=fff` }}
                            style={styles.postAvatar}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.postUserName}>{post.userFullName}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                            </View>
                          </View>
                          <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                            <Feather name="trash-2" size={20} color="#dc2626" />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.postDescription}>{post.description}</Text>
                        {post.imageUrls?.length > 0 && (
                          <Image source={{ uri: post.imageUrls[0] }} style={styles.postImage} />
                        )}
                        <View style={styles.postStats}>
                          <Text>{post.likesCount || 0} likes</Text>
                          <Text>{post.commentsCount || 0} comments</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {activeTab === 'appointments' && (userData?.role === 'Admin' || userData?.role === 'SuperAdmin') && (
            <>
              {appointmentsLoading ? (
                <ActivityIndicator size="large" color={colors.mainYellow} />
              ) : appointments.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="calendar" size={40} color={colors.mainYellow} />
                  <Text style={styles.emptyTitle}>No Appointments</Text>
                </View>
              ) : (
                <>
                  {/* Filter Buttons */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                  >
                    {['all', 'pending', 'accepted', 'completed'].map(filterType => (
                      <TouchableOpacity
                        key={filterType}
                        style={[
                          styles.filterButton,
                          appointmentFilter === filterType && styles.filterButtonActive
                        ]}
                        onPress={() => setAppointmentFilter(filterType)}
                      >
                        <Text 
                          style={[
                            styles.filterButtonText,
                            appointmentFilter === filterType && styles.filterButtonTextActive
                          ]}
                        >
                          {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Appointments List */}
                  <View style={styles.postsContainer}>
                    {appointments
                      .filter(apt => appointmentFilter === 'all' || apt.status === appointmentFilter)
                      .map(appointment => (
                        <View key={appointment.id} style={styles.appointmentCard}>
                          <View style={styles.appointmentHeader}>
                            <View 
                              style={[
                                styles.techAvatar,
                                { backgroundColor: colors.mainYellow }
                              ]}
                            >
                              <Text style={styles.techAvatarText}>
                                {appointment.techSupportName.charAt(0)}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.techName}>{appointment.techSupportName}</Text>
                              <View 
                                style={[
                                  styles.statusBadge, 
                                  { backgroundColor: getStatusColor(appointment.status) + '20' }
                                ]}
                              >
                                <Text 
                                  style={[
                                    styles.statusText, 
                                    { color: getStatusColor(appointment.status) }
                                  ]}
                                >
                                  {getStatusLabel(appointment.status)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.appointmentInfo}>
                            <View style={styles.infoRow}>
                              <Feather name="calendar" size={16} color={colors.mainYellow} />
                              <Text style={styles.infoText}>{appointment.date}</Text>
                            </View>
                            <View style={styles.infoRow}>
                              <Feather name="clock" size={16} color={colors.mainYellow} />
                              <Text style={styles.infoText}>{appointment.time}</Text>
                            </View>
                          </View>

                          {/* Rating Section */}
                          {appointment.status === 'completed' && (
                            <View style={styles.ratingSection}>
                              {appointment.rating ? (
                                <View style={styles.ratedContainer}>
                                  <Text style={styles.ratedLabel}>Your Rating:</Text>
                                  <View style={styles.starsContainer}>
                                    {[...Array(5)].map((_, i) => (
                                      <Feather
                                        key={i}
                                        name="star"
                                        size={18}
                                        color={colors.mainYellow}
                                        fill={i < appointment.rating ? colors.mainYellow : 'transparent'}
                                      />
                                    ))}
                                  </View>
                                </View>
                              ) : (
                                <View style={styles.rateContainer}>
                                  <Text style={styles.rateTitle}>Rate your experience</Text>
                                  <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <TouchableOpacity
                                        key={star}
                                        onPress={() => handleRateAppointment(appointment.id, star)}
                                      >
                                        <Feather
                                          name="star"
                                          size={24}
                                          color={colors.mainYellow}
                                        />
                                      </TouchableOpacity>
                                    ))}
                                  </View>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                  </View>
                </>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <View style={styles.emptyState}>
              <Feather name="heart" size={40} color={colors.mainYellow} />
              <Text style={styles.emptyTitle}>No Favorites</Text>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
              <Feather name={item.icon} size={20} color={colors.mainYellow} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {userData && (
          <EditProfileModal
            visible={showEditModal}
            userData={userData}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditProfile}
          />
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainBeige,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.mainYellow,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
    height: 40,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.mainYellow + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.mainYellow,
    marginBottom: 16,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mainYellow,
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainYellow,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
  },
  dashboardButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.platinum,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.mainYellow,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: 'white',
  },
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  overviewContainer: {
    gap: 16,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.mainBeige,
    marginBottom: 8,
  },
  statRowLabel: {
    fontSize: 14,
    color: colors.jet,
  },
  statRowValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainYellow,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.platinum,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginVertical: 16,
  },
  emptyButton: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  postsContainer: {
    gap: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.platinum,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.mainYellow,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBlack,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  postDescription: {
    fontSize: 15,
    color: colors.mainBlack,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.mainBlack,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.platinum,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.platinum,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  techAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  techName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBlack,
    marginBottom: 4,
  },
  appointmentInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
  },
  ratedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.jet,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  rateContainer: {
    alignItems: 'center',
  },
  rateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mainBlack,
    marginBottom: 8,
  },});