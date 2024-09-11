async function editUser(req, res) {
  const { id } = req.params;
  const { username, phoneNumber } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, phoneNumber },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user details.' });
  }
}
